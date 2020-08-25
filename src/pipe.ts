declare let Thenable :any;
interface IPipeInfo {
    handler:(input,states,pipe:Pipe,nextInfo:IPipeInfo,resolve,reject)=>void;
    raw:(input:any,states:any,pipe:Pipe)=>any;
    next?:IPipeInfo;
}
export class Pipe{
    head: IPipeInfo;
    tail: IPipeInfo;
    length:number;
    constructor(){
        this.length = 0;
    }
    pipe(name,handler?:(input:any,states:any,pipe:Pipe)=>any):Pipe{
        let len = this.length;
        if(!handler){
            handler = name;
            name = 'pipe-handler-' + len;
        }
        this.length = len+1;

        let internalHandler = (input,states,pipe:Pipe,nextInfo:IPipeInfo,resolve,reject)=>{
            let output = handler(input,states, pipe);
            let isBreak = false;
            if(output instanceof PipeBreak) {
                isBreak = true;
                output = output.value;
            }
            if(typeof output?.then ==='function'){
                output.then((value)=>{
                    if(nextInfo && !isBreak) {
                        nextInfo.handler(value,states,pipe,nextInfo.next,resolve,reject);
                    }else{
                        resolve(value);
                    }
                },reject);
            } else {
                if (nextInfo && !isBreak) nextInfo.handler(output,states,pipe,nextInfo.next,resolve,reject);
                else resolve(output);
            }
        };
        let info:IPipeInfo = {
            raw:handler,
            handler: internalHandler
        };
        let tail = this.tail;
        if (!tail) this.tail = this.head = info;
        else {
            this.tail = tail.next = info;
        }
        return this;
    }
    pump(value,states?):any{
        return new Thenable((resolve,reject)=>{
            let head = this.head;
            if(!head) return resolve(value);
            head.handler(value,states||{},this,head.next,resolve,reject);
        });
    }
}
export class PipeBreak{
    constructor(public value:any){}
}