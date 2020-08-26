


///////////////////////////////////////////////////////////////
// 类型判断

export function is_string(obj:any):boolean{
    return typeof obj ==="string";
}
export function is_bool(obj:any):boolean{
    return typeof obj ==="boolean";
}

export function is_number(obj:any):boolean{
    return typeof obj ==="number";
}
export function is_assoc(obj:any):boolean{
    if (!obj) return false;
    return Object.prototype.toString.call(obj)==="[object Object]";
}


export function is_object(obj:any):boolean{
    if (!obj) return false;
    let t= Object.prototype.toString.call(obj) as string;
    if (t.indexOf("[object ")==0) return true;
}

export function is_array(obj:any):boolean {
    if(!obj) return false;
    return Object.prototype.toString.call(obj)==="[object Array]";
}

export function is_empty(obj:any):boolean {
    if (!obj) return true;
    let t = typeof obj;
    if (t==="function" || t==="number" || t==="boolean")return false;
    for (let n in obj) return false;
    return true;
}
////////////////////////////////////////////////////////
// 字符串处理

let trimreg = /(^\s+)|(\s+$)/g;

/**
 *  去掉两边空格
 *
 * @export
 * @param {*} text
 * @returns {string}
 */
export function trim(text:any):string {
    if (text===null || text===undefined) return "";
    return text.toString().replace(trimreg, "");
}


/**
 * 判定字符串是否以某个串开始
 *
 * @export
 * @param {*} text 要判定的字符串
 * @param {*} token 开始标记字符串
 * @returns {boolean}
 */
export function startWith(text:any,token:any) :boolean {
    if(!text) return false;
    if(token===undefined || token===null) return false;
    return text.toString().indexOf(token.toString())===0;
}


/**
 * 判定字符串是否以某个串结束
 *
 * @export
 * @param {*} text 要检测的字符串
 * @param {*} token 结束标记字符串
 * @returns {boolean}
 */
export function endWith(text:any, token :any) :boolean{
    if(!text) return false;
    if(token===undefined || token===null) return false;
    text = text.toString();
    token = token.toString();
    return text.indexOf(token)===text.length - token.length;
}

let percentRegx = /([+-]?[\d,]+(?:.\d+))%/g;

/**
 * 是否是百分数
 *
 * @export
 * @param {*} text
 * @returns {number}
 */
export function is_percent(text:any):number {
    if (text===null || text===undefined) return undefined;
    let match = text.toString().match(percentRegx);
    if (match) return match[1];
}

/////////////////////
// 数组处理


export function array_index(obj:any, item:any, start:number=0):number {
    if(!obj) return -1;
    for(let i= start, j= obj.length; i<j; i++) {
        if(obj[i]===item) return i;
    }
    return -1;
}
export function array_contains(obj:any,item:any):boolean {
    return array_index(obj, item)>=0;
}
export function array_add_unique(arr:any[],item:any):boolean{
    if(!arr || !arr.push) return false;
    for (let i = 0, j=arr.length; i<j; i++) {
        if (arr[i]===item) return false;
    }
    arr.push(item);
    return true;
}
export function array_remove(arr:any[],item:any):boolean{
    if(!arr || !arr.push || !arr.shift) return false;
    let hasItem = false;
    for (let i = 0, j=arr.length; i<j; i++) {
        let existed = arr.shift();
        if (existed!==item) arr.push(existed);
        else hasItem = true;
    }
    return hasItem;
}
///////////////////////////////////////
// 对象处理


export let extend :(...args)=>any= function (){
    let target = arguments[0] ||{};
    for (let i=1, j=arguments.length; i<j; i++) {
        let o = arguments[i];
        if (o) for (let n in o) target[n] = o[n];
    }
    return target;
}

export function accessable(desc:any,target?,name?,value?){
    // 标记用法 @notation() 
    if(target===undefined) return function(target,name?) {
        if(name===undefined) {
            // 标记应用在class或object上 
            // @notation() class T {}
            target = target.prototype || target;
            for(let n in target) {
                desc.value = target[n];
                Object.defineProperty(target, n,desc);
            }
        }else {
            // 标记应用在成员上
            // class T { @notation() id:string;} 
            desc.value = target[name];
            Object.defineProperty(target, name, desc);
        }
    };
    if(name===undefined){
        // 指定对象所有成员的可访问性
        // implicit({name:''})
        for(let n in target) {
            desc.value = target[n];
            Object.defineProperty(target, n,desc);
        }
        return target;
    }

    if(typeof name==='object'){
        if(is_array(name)) {
            for(const membername of name) {
                desc.value = target[membername];
                Object.defineProperty(target, membername , desc);
            }
        }else {
            for(var n in name) {
                desc.value = name[n];
                Object.defineProperty(target , n , desc);
            }
        }
        return target;
    }
    desc.value = value;
    Object.defineProperty(target,name,desc);
    return target;
}


/**
 * 将成员变成隐式成员
 * 不会被for循环到
 * 但外部还是可以修改
 * 
 * @export
 * @param {*} [target]
 * @param {*} [name]
 * @param {*} [value]
 * @returns
 */
export function implicit(target?,name?,value?){
    return accessable({enumerable:false,writable:true,configurable:true},target,name,value);    
}
export function constant(enumerable?:boolean,target?,name?,value?){
    return accessable({enumerable:enumerable!==false,writable:false,configurable:true},target,name,value)
}

let cidSeeds : {[name:string]: number} = {};
function cid(name?:string):string{
    if (name===undefined) name = "cid";
    let seed = cidSeeds[name];
    if (seed===undefined) seed = cidSeeds[name] = 0;
    if (++seed>2100000000){
        seed = -2100000000;
        cidSeeds[name] = seed;
    } 
    return `${name}${seed}`;
}

export class Exception extends Error{
    constructor(message:string, infos?:{[name:string]:any}){
        super(message);
        if(infos) for(const n in infos) this[n] = infos[n];
    }
}

////////////////////////////////////////////////////////////////////////////////////
//
// Fulfill
//
enum FulfillStates{
    padding,
    fulfilled,
    rejected
}
class IFulfillInternalData<T>{
    '$-fulfill-status' : FulfillStates;
    '$-fulfill-value'? : T;
    '$-fulfill-resolves'? : {(value:any):any}[];
    '$-fulfill-rejects'? : {(err:any):any}[];
}
export interface IThenable<T> {
    then(fulfilled: (value:any)=>any, rejected: (err:any)=>any):IThenable<T>;
}
@implicit()
export class Thenable<T> implements IThenable<T>{
    constructor(process: (resolve: (value:any)=>any, reject:(value: any)=>any)=>any){
        let status:FulfillStates = FulfillStates.padding;
        let resolveCallbacks:{(value:any):any}[] = undefined; 
        let rejectCallbacks:{(value:any):any}[] = undefined; 
        let fulfillValue = undefined ;
        let resolve : (value:any)=>any = (value:any):any => {
            if(status!==FulfillStates.padding) throw new TypeError('已经处于终值状态,不能再调用resolve');
            if(fulfillValue) throw new TypeError('已经调用过resolve,传入的是Thenable');
            if(value===this) throw TypeError('不能resolve自己');
            if(typeof value?.then === 'function') {
                value.then(resolve, reject);
                return this;
            }
            if(resolveCallbacks) setTimeout(()=>{
                for(const handler of resolveCallbacks) 
                    handler(fulfillValue);
            },0);
            return this;
        };//end resolve
        let reject :(err:any)=>any = function(err:any):any{
            if(status!==FulfillStates.padding) throw new TypeError('已经处于终值状态,不能再调用resolve');
            if(fulfillValue) throw new TypeError('已经调用过resolve,传入的是Thenable');
            if(rejectCallbacks) setTimeout(()=>{
                for(const handler of rejectCallbacks) 
                    handler(fulfillValue);
            },0);
            return this;
        }

        implicit(this,'then',function(resolved,rejected?):Thenable<any>{
            if (status===FulfillStates.fulfilled){
                if (resolved) setTimeout(() => {
                    resolved(fulfillValue);
                }, 0);
                return this;
            } else if (status===FulfillStates.rejected) {
                if (rejected) setTimeout(() => {
                    rejected(fulfillValue);
                }, 0);
                return this;
            }
            return new Thenable((nextResolve,nextReject)=>{
                if (resolved){
                    if (!resolveCallbacks) resolveCallbacks=[];
                    resolveCallbacks.push(function(value):any {
                        if (typeof value?.then==='function') {
                            value.then(nextResolve,nextReject);
                        } else {
                            nextResolve(value);
                        }
                    });
                };
                if (!rejectCallbacks) rejectCallbacks=[];
                if (reject) {
                    rejectCallbacks.push(reject);
                }
                rejectCallbacks.push(nextReject);
            });
        });
        if(process){
            setTimeout(() => {
                process(resolve, reject);
            }, 0);
        }
    }
    then(resolve,reject):Thenable<any>{
        throw 'placehold function';
    }
    static isThenable(obj):boolean {
        return typeof obj?.then === 'function';
    }
}


export interface IDisposable{
    dispose(listenerOrEvent?:any):IDisposable;
}

export function disposable(obj):IDisposable{
    implicit(obj,'dispose' , function(handler?):IDisposable{
        let disposeHandlers = this['$-dispose-handlers'];
        if (disposeHandlers===null) throw new Exception("已经被释放，不能再调用dispose",{'disposedObject':this});
        
        if(handler===undefined){
            if(disposeHandlers){
                for (const dHandler of disposeHandlers) {
                    dHandler.call(this);
                }
                constant(false,this, '$-dispose-handlers', null);
            } 
        }else{
            if (disposeHandlers===undefined) {
                constant(false,this, '$-dispose-handlers', disposeHandlers=[]);
            }
            disposeHandlers.push(handler);
        }
        return this;
    });
    return obj;
}

export class Disposable implements IDisposable{
    dispose(handler?):Disposable { return this;}
}
disposable(Disposable.prototype);

export class Subject extends Disposable {
    '$-subject-topics' : { [topic: string]: {(...args: any[]):any}[] };

    subscribe(
        topic: string | { (...evt: any[]):any }, 
        listener?:{ (...evts: any[]):any } | IDisposable, 
        refObject?:IDisposable
    ):Subject {
        if ( listener===undefined ){
            listener = topic as (...evts:any[])=>any;
            topic = "";
            refObject = undefined;
        } else if ( (listener as IDisposable).dispose ){
            refObject = listener as IDisposable;
            listener = topic as {(...evt:any[]):any};
            topic ="";
        }
        if (typeof listener!=='function') 
            throw new Exception(`subject的lisntener必须是函数`,{'listener':listener});

        let topics = this['$-subject-topics'];
        if(topics===null) throw new Exception('该对象已经被释放',{'disposedObject':this})
        if(!topics) constant(false, this, '$-subject-topics', topics= this["$-subject-topics"]={});
        let listeners = topics[topic as string] || ( topics[topic as string]= [] );
        listeners.push(listener as (...evts:any[])=>any);
        if(refObject){
            refObject.dispose( ()=>{
                array_remove(listeners,listener);
            });
        }
        return this;
    }
    unsubscribe(
        topic: string | {(evt:any):any},
        listener: {(evt:any):any}
    ):Subject {
        if( listener===undefined ){
            listener = topic as (...evt:any[])=>any;
            topic = "";
        }
        let topics = this['$-subject-topics'];
        if (topics) {
            let listeners = topics[topic as string];
            array_remove(listeners,listener);
        }       
        
        return this;
    }

    notify(topic:any, evt?, ...evts:any[]):Subject {
        let topics = this['$-subject-topics'];
        if (!topics) return this;
        let listeners,ckIndex;
        if (typeof topic !=="string") {
            listeners = topics[''] ;
            ckIndex = 1;
        }else{
            listeners = topics[topic as string];
            ckIndex=2;
        }
        if(!listeners) return this;
                
        let args,useApply;
        if ( arguments[ckIndex]!==undefined ) {
            args = [];useApply= true;
            for (let i=0, j=arguments.length; i<j; i++) 
                args.push(arguments[i]);
        } else args = arguments[ckIndex-1];

        for (let i= 0, j= listeners.length; i<j; i++){
            let handler = listeners[i];
            if(useApply) 
                handler.apply(this, args);
            else 
                handler.call(this, args);
        }
        return this;
    }
    dispose(handler?):Subject{
        if(handler!==undefined) {
            return super.dispose(handler) as Subject
        }else{
            constant(false,this,'$-subject-topics',null);
        }
        return this;
    }
}

export enum SchemaTypes{
    value,object,array,computed
}
@implicit()
export class Schema{
    $schemaName: string;
    private '$-schema-root': Schema;
    private '$-schema-name-paths-from-root': string[];

    /**
     * 在作用域上的名字
     * 如果为空，表示不是作用域变量
     * 如果该字段有值，表示该Schema的变量将会从scope上面去取
     * 
     * @type {string}
     * @memberof Schema
     */
    $schemaScopedName?: string;
    private '$-schema-scoped': Schema;
    private '$-schema-name-paths-from-scoped': string[];

    $schemaOwn: Schema;
    $schemaDefaultValue: any;
    $schemaArrayItem: Schema;
    $schemaType: SchemaTypes;

    constructor(defaultValue, ownSchema?: Schema, name?: string){
        if (defaultValue===Schema) return;
        if ( defaultValue && defaultValue.$schemaType!==undefined ) defaultValue = defaultValue.$schemaDefaultValue;
        
        implicit(this, {
            '$schemaName': name,
            '$-schema-root': undefined,
            '$-schema-name-paths-from-root':undefined,

            '$scopedName': undefined,
            '$-schema-scoped': undefined,
            '$-schema-name-paths-from-scope':undefined,

            '$schemaOwn': ownSchema,
            '$schemaDefaultValue': defaultValue,
            '$schemaType': SchemaTypes.value,
            '$schemaArrayItem': undefined
        });

        
        let t = typeof defaultValue;
        if (t==='object') {
            if (is_array(defaultValue)) {
                this.asArray(defaultValue[0]);
            } else {
                for (let n in defaultValue) {
                    this.defineProp(n, defaultValue[n]);
                }
            }
        }
    }
    defineProp(name:string, propDefaultValue?):Schema{
        if ( this.$schemaType===SchemaTypes.value ) {
            this.$schemaType = SchemaTypes.object;
            if( this.$schemaDefaultValue===undefined )
                this.$schemaDefaultValue = {};
        } else if( this.$schemaType===SchemaTypes.array ) {
            throw new Error(`已经是array了，不可以再定义属性`);
        }
        if ( propDefaultValue===undefined ) {
            propDefaultValue = this.$schemaDefaultValue ? this.$schemaDefaultValue[name] : undefined;
        }
        let propSchema = new Schema(propDefaultValue, this, name);
        this[name] = propSchema;
        return propSchema;
    }
    asObject(dftValue?):Schema{
        if ( this.$schemaType===SchemaTypes.value ) {
            this.$schemaType = SchemaTypes.object;
            if( this.$schemaDefaultValue===undefined )
                this.$schemaDefaultValue = {};
        } else if( this.$schemaType===SchemaTypes.array ) {
            throw new Error(`已经是array了，不可以再定义属性`);
        }

        if (dftValue) for (var n in dftValue) {
            let existed:Schema = this[n];
            let propValue = dftValue[n];
            let propSchema:Schema;
            if (existed) {
                if(!propValue) continue;
            }
            propSchema = new Schema(propValue, this, name);
            this[n] = propSchema;
        }
        return this;
    }
    asArray(dftItemValue?:any):Schema{
        if ( this.$schemaArrayItem && dftItemValue===undefined ) return this.$schemaArrayItem;
        if ( this.$schemaType!==SchemaTypes.value ) {
            throw new Error(`已经是array/object了，不可以再定义item`);
        }
        this.$schemaType = SchemaTypes.array;
        let  itemSchema =  new Schema(dftItemValue, this);
        this.$schemaArrayItem = itemSchema;
        let lengthSchema = new Schema(0, this, 'length');
        constant(false , this, 'length', lengthSchema);
        return itemSchema;
    }

    getRootSchema():Schema{
        let root = this['$-schema-root'];
        if ( !root ) {
            root = this;
            while ( root.$schemaOwn ){
                root = root.$schemaOwn;
            }
            this['$-schema-root'] = root;
        }
        return root;
    }
    getNamePaths():string[] {
        let names:string[] = this['$-schema-name-paths-from-root'];
        if(names) return names;
        names = [this.$schemaName];
        let schema = this as Schema;
        while (schema) {
            names.unshift( schema.$schemaName );
            schema = schema.$schemaOwn;
        }
        this['$-schema-name-paths-from-root'] = names;
        return names;
    }

    getValueFromRoot( target ):any{
        let names = this.getNamePaths();
        let value = target;
        for(const name of names) {
            value = value[name];
            if(value===undefined) return value;
        }
        return value;
    }

    getScopedSchema():Schema{
        let scoped = this['$-schema-scoped'];
        if (scoped===undefined) {
            scoped = this;
            while ( scoped && !scoped.$schemaScopedName ) {
                scoped = scoped.$schemaOwn;    
            }
            this['$-schema-root'] = scoped || null;
        }
        return scoped;
    }
    getScopedNamePaths():string[]{
        let names:string[] = this['$-schema-name-paths-from-scoped'];
        if( names ) return names;
        names = [];
        let schema = this as Schema;
        while (schema && !schema.$schemaScopedName ) {
            names.unshift(schema.$schemaName);
            schema = schema.$schemaOwn;
        }
        if (schema) names.unshift(schema.$schemaScopedName);
        this['$-schema-name-paths-from-scoped'] = names.length===0 ? null : names;
        return names;
    }

    getValueFromScope(scope:Scope,schema?:Schema|IDisposable,initValue?:any, onlyCheckCurrentScope?:boolean):any {
        let names = this.getScopedNamePaths();
        if (!names) {
            console.warn(`没有找到scopedName,默认返回undefined`, this, scope);
        }
        let value = scope.reactive(names[0],!schema|| (schema as Schema).$schemaType===undefined?undefined:schema as Schema,initValue, onlyCheckCurrentScope);
        for (let i=1 ,j=names.length; i<j;i++) {
            value = value[names[i]];
            if(value===undefined) return value;
        }
        return value;
    }
    
    createReactive(ownOrValue?):Reactive{
        return new Reactive(ownOrValue,this);
    }
}
@implicit()
export class ComputedSchema{
    $schemaType:SchemaTypes;
    $schemaFunc:Function;
    $schemaDependences:Schema[];
    constructor(func:Function, deps:Schema[]){
        implicit(this,{
            '$schemaType':SchemaTypes.computed,
            '$schemaFunc':func,
            '$schemaDependences':deps
        });
    }
    getValueFromScope(scope:Scope,own?:IDisposable){
        return new ComputedReactive(this,scope,own);
    }
}
export function computed(){
    let deps = [];
    for(let i=0,j=arguments.length-1; i<j; i++){
        deps.push(arguments[i]);
    }
    let func = arguments[arguments.length-1];
    return new ComputedSchema(func,deps);
}
@implicit()
export class ComputedReactive extends Subject {
    $reactiveType: SchemaTypes;
    $reactiveDependences:Reactive[];
    $reactiveSchema:ComputedSchema;
    $reactiveScope:Scope;
    $reactiveValue:any;
    constructor(schema:ComputedSchema,scope:Scope,own?:IDisposable){
        super();
        let deps = [];
        let args=[];
        for(const depSchema of schema.$schemaDependences){
            let depReactive = depSchema.getValueFromScope(scope,own);
            deps.push(depReactive);
            args.push(depReactive.$reactiveValue);
            depReactive.subscribe((e)=>{
                this.get(e);
            },own);
        }
        let value;
        try{
            value = schema.$schemaFunc.apply(this,args);
        }catch(ex){
            console.warn('计算表达式无法正常完成',this,args);
        }
        implicit(this,{
            '$reactiveType': SchemaTypes.computed,
            '$reactiveDependences': deps,
            '$reactiveSchema':schema,
            '$reactiveScope': scope,
            '$reactiveValue':value
        });
    }
    get(src?){
        let args = [];
        for(const depReactive of this.$reactiveDependences){
            args.push(depReactive.get());
        }
        let newValue;
        try{
            newValue = this.$reactiveSchema.$schemaFunc.apply(this,args);
        }catch(ex){
            console.warn('计算表达式无法正常完成',this,args);
        }
        let oldValue = this.$reactiveValue;
        if(oldValue!==newValue){
            this.$reactiveValue = newValue;
            let evt = {type:ChangeEventTypes.setted,src:src,sender:this,value:newValue,old:oldValue};
            this.notify('',evt);
        }
        return newValue;
    }
    
}


export interface IChangeItem{
    index:number;
    value:any;
    reactive:Reactive;
}
export enum ChangeEventTypes{
    setted,
    appended,
    removed,
}

export interface IChangeEvent{
    type:ChangeEventTypes;
    value:any;
    old?:any;
    src?:any;
    cancel?:boolean;
    sender?:Reactive;
    
}

export interface IArrayChangeEvent extends IChangeEvent{
    removes?:IChangeItem[];
    updates?:IChangeItem[];
    appends?:IChangeItem[];
}

@implicit()
export class Reactive extends Subject{
    $reactiveName:string;
    $reactiveValue:any;
    $reactiveOwn:Reactive;
    $reactiveSchema:Schema;
    $reactiveType:SchemaTypes;
    $reactiveScope?:Scope;
    
    constructor(ownOrValue:any, schema:Schema, name?:string, scope?:Scope){
        super();
        
        name = name===undefined?schema?.$schemaName:name;
        let own:Reactive, value;
        if (ownOrValue instanceof Reactive) {
            own = ownOrValue;
            let ownValue = own.$reactiveValue;
            if(ownValue) value = ownValue[name];
        } else if (ownOrValue!==Reactive) {
            value = ownOrValue;
        }
        if(!schema) 
            schema = new Schema(value);
        if (value===undefined) 
            value = schema.$schemaDefaultValue;
        
        implicit(this, {
            '$reactiveName': name,
            '$reactiveSchema': schema,
            '$reactiveOwn': own,
            '$reactiveType': schema?schema.$schemaType:SchemaTypes.value,
            '$reactiveScope': scope
        });
        // Reactive作为第一个参数，是不做类型检查，用于constantReactive等
        if (ownOrValue===Reactive) {
            implicit(this, '$reactiveValue', value);
            return;
        }
        
        if (schema.$schemaType===SchemaTypes.object) {
            if(typeof value!=="object") value = {};
            implicit(this, '$reactiveValue', value);
            for (let n in schema){
                let fc = n[0];
                if(n==="constructor" || fc==="$" || fc==="_" || fc==="-") continue;
                let subReacitve = new Reactive(this, schema[n], n);
                this[n] = subReacitve;
            }
            
        } else if (schema.$schemaType===SchemaTypes.array) {
            if (typeof value!=="object") value = [];
            implicit(this, '$reactiveValue', value);
            for (let i = 0,j =value.length; i<j; i++) {
                let itemReacitve = new Reactive(this,schema.$schemaArrayItem,i as any as string);
                this[i] = itemReacitve;
            }
            let numRegx = /^\d+$/;
            for (let n in schema){
                if(!numRegx.test(n))continue;
                if(!this[n]){
                    let itemReacitve = new Reactive(this,schema.$schemaArrayItem, n);
                    this[n] = itemReacitve;
                }
                
            }
            let lengthReactive = new Reactive(this,(schema as any).length);
            constant(false, this, 'length', lengthReactive);
        } else{
            implicit(this, '$reactiveValue', value);
        }
        
    }
    update(value,src?, changeType?: ChangeEventTypes):Reactive{
        let schemaType = this.$reactiveSchema.$schemaType; 
        if (schemaType===SchemaTypes.object) {
           updateObject(this, value, src);       
        } else if(schemaType===SchemaTypes.array) {
            updateArray(this, value, src);
        } else {
            let old = this.$reactiveValue;
            if (value===old) return this;
            this.$reactiveValue=value;
            if (this.$reactiveOwn) {
                this.$reactiveOwn.$reactiveValue[this.$reactiveName] = value;
            }
            this.notify("",{
                type: changeType===undefined?ChangeEventTypes.setted:changeType, value:value, old:old, src:src||this, sender:this
            });
        }
        return this;
    }
    get():any{
        let schemaType = this.$reactiveSchema.$schemaType;
        if (schemaType === SchemaTypes.object){
            let result:any = {};
            for (let n in this){
                let reactive = this[n];
                if (reactive instanceof Reactive) result[n]= reactive.get();
            }
            return result;
        } else if(schemaType === SchemaTypes.array) {
            let result = [];
            for (let n in this){
                let reactive = this[n];
                if (n!=="length" && reactive instanceof Reactive) 
                    result.push(reactive.get());
            }
            return result;
        }else{
            return this.$reactiveValue;
        }
    }
}

@implicit()
export class ConstantReactive extends Reactive{
    constructor(value:any, name?:string) {
        super(Reactive, undefined);
        this.$reactiveValue = value;
        this.$reactiveName = name;
    }
    subscribe(topic, listener?, refObj?):ConstantReactive {
        return this;
    }
    unsubscribe(topic, listener?):ConstantReactive {
        return this;
    }
    notify(...args:any[]):ConstantReactive {
        return this;
    }
    get():any { return this.$reactiveValue; }
    update(value):ConstantReactive {
        debugger
        console.warn(`在ConstantReactive上调用了update操作,忽略。`,this,value);
        return this;
    }

}

function updateObject(reactive:Reactive, value, src) {
    let old = reactive.$reactiveValue;
    value || (value={});
    reactive.$reactiveValue = value;
    if (reactive.$reactiveOwn){
        reactive.$reactiveOwn.$reactiveValue[reactive.$reactiveName] = value;
    }
    let event:IChangeEvent = {
        type: ChangeEventTypes.setted, value: value, old: old, sender: reactive, src: src||reactive
    };
        
    let keys = Object.keys(value);
    for (const n of keys) {
        let propReacitve = reactive[n];
        if(propReacitve instanceof Reactive){
            propReacitve.update(value[n], event);
        }
    }
    return reactive;  
}

function updateArray(reactive:Reactive, value, src) {
    let old = reactive.$reactiveValue;
    value || (value=[]);
    reactive.$reactiveValue=value;
    if (reactive.$reactiveOwn) {
        reactive.$reactiveOwn.$reactiveValue[reactive.$reactiveName] = value;
    }
    
    
    let lengthReactive = (reactive as any).length as Reactive;
    let oldLength = lengthReactive.$reactiveValue;
    let newLength = value.length;
    let appends:IChangeItem[] = [];
    let removes:IChangeItem[] = [];
    let updates:IChangeItem[] = [];
    for (let i =0, j=oldLength; i<j; i++) {
        let existsReactive = reactive[i] as Reactive;
        let changeItem = { index: i, value: value[i], reactive:existsReactive };
        if(i<newLength){
            updates.push(changeItem);
        }else {
            removes.push(changeItem);
            delete reactive[i as any as string];
        }
    }
    for ( let i=oldLength, j=newLength; i<j; i++ ) {
        let newItemReactive = new Reactive(reactive, reactive.$reactiveSchema.$schemaArrayItem, i);
        reactive[i as any as string] = newItemReactive;
        appends.push({ value: value[i], reactive: newItemReactive, index: i });

    }
    
    if ( appends.length) {
        let event :IArrayChangeEvent= {
            type: ChangeEventTypes.appended, value:value, old:old, src:src||reactive, 
            appends:appends,sender:reactive
        };
        reactive.notify(event);
    }
    for (const item of removes) {
        item.reactive.update(undefined,event, ChangeEventTypes.removed);
    }
    for (const item of updates) {
        item.reactive.update(item.value,event);
    }
}
///////////////////////////////////////////////////////////////////////////
// Scope
@implicit()
export class Scope{
    '$-scope-root'? : Scope;
    '$-scope-parent' : Scope;
    '$-scope-name': string;
    constructor(parent?:Scope,name?:string){
        constant(false,this,'$-scope-parent',parent);
        constant(false,this,'$-scope-name',name);
    }
    reactive(name:string, schema:Schema, initValue?, onlyCheckCurrentScope?:boolean):Reactive{
        let reactive:Reactive;
        if (schema===undefined){
            let scope:Scope = this;
            while(scope) {
                if(reactive = scope[name]) break;
                if(onlyCheckCurrentScope) break;
                scope = scope['$-scope-parent'];
            }
        }
        if (!reactive){
            reactive = new Reactive(initValue, schema,undefined, this);
            this[name] = reactive;
        }else {
            if(initValue!==undefined) reactive.update(initValue);
        }
        return reactive;
    }

    
    createScope(name?:string):Scope{
        return new Scope(this,name);
    }
    rootScope():Scope{
        let root = this['$-scope-root'];
        if(root) return root;
        root = this;
        while (root){
            let p = root["$-scope-parent"]; 
            if (p) root = p;
            else {
                constant(false,this,'$-scope-root',root);
                return root;
            }
        }
    }
    dispose(){
        for(let n in this){
            let reactive:any = this[n]
            if(typeof reactive.dispose==='function') reactive.dispose()
        }
    }
}



///////////////////////////////////////////////////////////////////////////
//VNode
export interface INodeDescriptor{
    tag? : string,
    component? : {new():IComponent<any>};
    attrs? : {[name:string]:any},
    content? : string;
    children? : INodeDescriptor[];
}
function _createNodeDescriptor(tag:string|{new()}, attrs:string|{[name:string]:any}):INodeDescriptor {
    let vnode :INodeDescriptor={};
    let tagType = typeof tag;

    if(tagType==="string") 
        vnode.tag = tag as string;
    else if(tagType==="function") 
        vnode.component=  tag as {new()}; 
    else 
        {vnode.content= attrs as string;return vnode;}
    
    vnode.attrs = attrs as {[name:string]:any};
    let children :INodeDescriptor[];
    for (let i = 2; i<arguments.length; i++) {
        let child = arguments[i];
        if (!children) children=[];
        if (typeof child==="string") 
            children.push({content:child});
        else 
            children.push(child);
    }
    vnode.children = children;
    return vnode;
}
export let createNodeDescriptor: 
    (tag: string | {new()}, attrs: string | { [name:string]:any }, ...args: any[])=>INodeDescriptor 
    = _createNodeDescriptor;

globalThis.createVNode = createNodeDescriptor;

////////////////////////////
// component

export type TStatesSchemaBuilder = ( builder: (statesSchema:Schema)=>any ) => any; 

export type TComponentCtor = { new( 
    statesSchemaBuilder?: TStatesSchemaBuilder
):IComponent<any> };

export type TTemplateFunc = (
    states: any, 
    statesSchemaBuilder?: TStatesSchemaBuilder
)=>any;

export type TComponentFunc = TComponentCtor | TTemplateFunc;

export interface IComponentMeta{
    tag? : string;
    vnode? : INodeDescriptor;
    statesSchema?: Schema;
    localSchemas? : { [name:string] : Schema };
}

export interface IComponent<T> extends IDisposable{
    $meta : IComponentMeta;
    $cid : string;
    $tag? : string;
    $scope : Scope;
    $states : Reactive;
    $ownComponent? : IComponent<any>;
    $element? : any;
    template : INodeDescriptor|TTemplateFunc;
    render?(element:HTMLElement, vm:any):HTMLElement;
    refresh(states:T):IComponent<T>;
}
declare let Proxy;
let proxyHandlers = {
    get: function(obj:Schema, name:string) {
        if (name==='$-schema-proxy-raw') 
            return obj;
        let value = obj[name];
        if (value===undefined) 
            return createSchemaProxy(obj.defineProp(name));
        let ch = name[0];
        if (ch==='$' || ch==='_' || ch==='-') 
            return value;
        if (value instanceof Schema) 
            return createSchemaProxy(value);
        return value;
    }
};

function createElement(descriptor:INodeDescriptor ,ownComponent?:IComponent<any>, scope?:Scope, ignoreDirective?:boolean):HTMLElement {
    if(!scope){
        if(ownComponent) scope = ownComponent.$scope;
        else scope = new Scope();
    }
    if(!ignoreDirective){
        let elem = createIterationNodes(descriptor,ownComponent,scope);
        if(elem) return elem;
    }
    let element = createComponentNode(descriptor,ownComponent,scope);
    if (!element) {
        element = createElementNode(descriptor, ownComponent, scope);
        if (!element)
            element = createTextNode(descriptor.content, ownComponent,scope);
    }
    return element;
}


/**
 * 创建迭代for-each,for-as
 *
 * @param {INodeDescriptor} descriptor
 * @param {IComponent<any>} [ownComponent]
 * @param {Scope} [scope]
 */
function createIterationNodes(descriptor:INodeDescriptor, ownComponent?:IComponent<any>, scope?:Scope):HTMLElement{
    //没有属性，肯定不是迭代
    let attrs:{[name:string]:any} = descriptor.attrs;
    if (!attrs) return undefined;
    let each = attrs['for-each'];
    if (!each) return undefined;
    if (each["$-schema-proxy-raw"]) each = each["$-schema-proxy-raw"];
    if(!each) return undefined;
    let itemSchema:Schema = attrs['for-as'];
    if (!itemSchema) throw new Exception('没找到for-as',{'nodeDescriptor':descriptor,'ownComponent':ownComponent});
    if (itemSchema["$-schema-proxy-raw"]) itemSchema = itemSchema["$-schema-proxy-raw"];
    if (!itemSchema.$schemaType)throw new Exception('for-as 必须是Scheme,请用YA.for/YA.local创建循环变量',{'nodeDescriptor':descriptor,'ownComponent':ownComponent});
    let anchor = document.createComment('for-each/as anchor node') as any as HTMLElement;
    
    setTimeout(()=>{
        let eachReactive = each;
        if(eachReactive.$schemaType!==undefined) eachReactive = each.getValueFromScope(scope,ownComponent)
        renderIteration(descriptor,ownComponent,eachReactive,itemSchema,anchor,scope);
    }, 0);
    return anchor as any as HTMLElement;
}

function renderIteration(descriptor:INodeDescriptor,ownComponent:IComponent<any>,eachReactive:Reactive,asSchema : Schema,anchor:HTMLElement,eachScope:Scope){
    for (const n in eachReactive) {
        let itemReactive = eachReactive[n];
        renderIterationItem(descriptor,ownComponent,itemReactive,asSchema,anchor,eachScope);
    }
    if (eachReactive.$reactiveType!==undefined){
        eachReactive.subscribe((e:IArrayChangeEvent)=>{
            if(!e.appends) return;
            for(const appendItem of e.appends){
                renderIterationItem(descriptor,ownComponent,appendItem.reactive,asSchema,anchor,eachScope);
            }
        },ownComponent);
    }
}

function renderIterationItem(descriptor:INodeDescriptor,ownComponent:IComponent<any>,itemReactive,asSchema : Schema,anchor:HTMLElement,eachScope:Scope){
    let itemScope = eachScope.createScope(asSchema.$schemaScopedName);
    itemScope[asSchema.$schemaScopedName] = itemReactive;
    let elem = createElement(descriptor, ownComponent,itemScope, true);
    anchor.parentElement.insertBefore(elem,anchor);
    itemReactive.subscribe((e:IChangeEvent)=>{
        if(e.type=== ChangeEventTypes.removed){
            if(elem.parentNode) elem.parentElement.removeChild(elem)
        }
    },ownComponent);
    return elem;
}


function createComponentNode(descriptor:INodeDescriptor, ownComponent: IComponent<any>, scope?: Scope):HTMLElement {
    let componentFunc: TComponentFunc;
    if (descriptor.component) {
        componentFunc = descriptor.component;
    } else if (descriptor.tag) componentFunc = componentTypes[descriptor.tag];
    if(!componentFunc) return null;

    let component = newComponent(componentFunc, descriptor.attrs, ownComponent, scope);
    bindComponentStates(component,descriptor.attrs,scope)
    let element = component.$element = createElement(component.$meta.vnode, component,component.$scope);
    constant(false, element,'$-ya-component', component);
    constant(false, component,'$element',element);
    return element;
}
function newComponent(
    componentFunc: TComponentFunc,
    vm: { [name:string]: any },
    ownComponent: IComponent<any>,
    scope:Scope
):IComponent<any> {
    // 获取或构建componentType
    let componentType:TComponentCtor;
    let isTemplateFunc = false;
    // 没有template方法，它自己就是template方法
    if (!componentFunc.prototype.template) {
        isTemplateFunc = true;
        // 从template方法中获取到原先构建的componentType
        componentType = componentFunc['$-component-type'];
        // 没获取到，表示从未构建，要重新构建一个componentType
        if ( !componentType ){
            let template = componentFunc;
            componentType = function(){} as any;
            componentType.prototype.template = template;
            constant(false, template,'$-component-type', componentType);
            constant(false, componentType,'$-component-template', template);
        }
    } else componentType = componentFunc as TComponentCtor;
    
    let meta:IComponentMeta = componentType.prototype.$meta;
    if(!meta) {
        constant(false, componentType.prototype, '$meta', meta = {});
    }
    meta.localSchemas || (meta.localSchemas={});

    let statesSchemaBuilder:TStatesSchemaBuilder = sureStatesSchema(meta, componentType);
    
    let component:IComponent<any> = new componentType(statesSchemaBuilder||function(){});
    constant(false,component,'$ownComponent', ownComponent);
    sureTagAndIds(component, meta, componentType);
    sureNodeDescriptor(component, meta, statesSchemaBuilder, vm);
    
    if (!component.dispose) { disposable(component); }
    

    scope || (scope = ownComponent?.$scope);
    
    let componentScope =  scope ? scope.createScope(component.$tag+cid("@CS")) : new Scope();
    constant(false, component,'$scope',componentScope);
    constant(false, component,'$states',componentScope.reactive('states',meta.statesSchema, vm));
   
    return component;
}

function sureStatesSchema(meta:IComponentMeta, componentType :TComponentCtor): TStatesSchemaBuilder {
    let statesSchemaBuilder: TStatesSchemaBuilder;
    if (!meta.statesSchema) {
        let statesSchema = new Schema(undefined, undefined);
        statesSchema.$schemaScopedName = "states";
        meta.statesSchema = statesSchema;
        statesSchemaBuilder = ( builder: (statesSchema:Schema)=>any )=> {
            let dftStatesObj = builder.call(this , statesSchema);
            if (dftStatesObj!==undefined){
                statesSchema.asObject(dftStatesObj);
            }
        };
        
    }
    return statesSchemaBuilder;
}

function sureTagAndIds(compInstance:IComponent<any>, meta:IComponentMeta, componentType:TComponentCtor){
    let tag = compInstance.$tag;
    if(!tag) {
        tag = meta.tag || (meta.tag = cid('ya-component-type-'));
        constant(false,compInstance,'$tag',tag);
        constant(false,componentType.prototype,'$tag',tag);
    }
    let existed = componentTypes[tag];
    if(existed){
        if(existed !== componentType) {
            componentTypes[tag] = componentType;
            console.warn(`标签${tag}被替换成了新的组件类`, componentType, existed);
        } 
    }else componentTypes[tag] = componentType;

    constant(false,compInstance, '$cid',  cid(tag+'@'));
}

function sureNodeDescriptor(component:IComponent<any>, meta:IComponentMeta,statesSchemaBuilder:TStatesSchemaBuilder, vm:INodeDescriptor){
    let vnode = meta.vnode;
    if (vnode===undefined){
        let proxy = createSchemaProxy(meta.statesSchema, vm);
        templateStack.push(meta.localSchemas);
        try{
            vnode = meta.vnode = 
                typeof component.template==="function"
                    ? component.template(proxy,statesSchemaBuilder) 
                    : component.template;
        }finally{
            templateStack.pop();
        }
    }
}

function createSchemaProxy(schema, defaultValue?) {
    if (defaultValue!==undefined) 
        schema.$schemaDefaultValue = defaultValue;
    return new Proxy(schema, proxyHandlers);
}

let templateStack: { [name:string] : Schema }[] = [];

export function local<T>(localSchema?:Schema,name?:string):T {
    localSchema || (localSchema = new Schema(undefined));
    //if(arraySchema) return arraySchema.asArray() as any as T;
    let context = templateStack.pop();
    let localVarName:string;
    if(name) {
        localVarName = name + cid('@LVN');
    }else{
        let localVarNo:any = context['$-localvar-no'];
        if(localVarNo===undefined) localVarNo = context['$-localvar-no'] = 0 as any;
        
        localVarName = '$-local-' + localVarNo;
        context['$-localvar-no'] = (++localVarNo) as any;
    }
    localSchema.$schemaScopedName = localVarName;
    context[localVarName] = localSchema;
    
    templateStack.push(context);
    return localSchema as any;
}

export function localFor<T>(schema:Schema,name?:string):T {
    return local<T>(schema.$schemaArrayItem,name);
}
function bindComponentStates(component: IComponent<any>, attrs: { [name: string]:any },scope:Scope){
    let innerStates = component.$states;
    for (let attrName in attrs)(function(attrName:string, bindValue, innerStates:Reactive) {
        if ( bindValue && bindValue["$-schema-proxy-raw"] ) 
            bindValue = bindValue["$-schema-proxy-raw"];
        let prop = innerStates[attrName] as Reactive;
        if (!prop) {
            let bindVal= bindValue 
            ? ( bindValue.$reactiveType!==undefined ? bindValue.$reactiveValue : bindValue)
            : bindValue;
            prop = innerStates[attrName] = new ConstantReactive(bindVal, attrName);
        }
        
        if (bindValue instanceof Schema){
            let bindValueReactive = bindValue.getValueFromScope(scope,component) as Reactive;
            let handler = (e:IChangeEvent)=>{
                let propReactive = (innerStates as any)[attrName];
                if(propReactive instanceof Reactive){
                    propReactive.update(e.value);
                }
            };
            //外面的变化后，触发里面的变化
            bindValueReactive.subscribe(handler,component);
        }else prop.$reactiveValue = bindValue;
    })(attrName,attrs[attrName],innerStates);
}

let eventNameRegx = /^on/g;
function createElementNode(descriptor:INodeDescriptor, ownComponent:IComponent<any>, scope:Scope):HTMLElement {
    if(!descriptor.tag) return null;

    let element = document.createElement(descriptor.tag);
    let attrs = descriptor.attrs;
    let children = descriptor.children;

    for(let attrName  in attrs){
        if(attrName==='for-each' || attrName==='for-as' || attrName==='if' || attrName==='if-not') continue
        let attrValue = attrs[attrName];
        //if(attrName[0])
        //将代理去掉，获取原始的schema
        if(attrValue && attrValue["$-schema-proxy-raw"]) attrValue = attrValue["$-schema-proxy-raw"];
        if(eventNameRegx.test(attrName) && element[attrName]===null ){
            bindEvent(element,attrName,attrValue,ownComponent,scope);
            continue;
        }
        bindAttr(element,attrName,attrValue,ownComponent,scope);
    }
    if(children)for(const child of children){
        let childElement :HTMLElement;
        if(!child) continue;
        if(child["$-schema-proxy-raw"]) {
            childElement = createTextNode(child["$-schema-proxy-raw"], ownComponent, scope);
        }else if((child as Schema).$schemaType!==undefined){
            childElement = createTextNode(child as Schema, ownComponent, scope);
        }else {
            childElement = createElement(child,ownComponent,scope);
        }
        
        element.appendChild(childElement);
    }
    return element;
}

function bindAttr(element:HTMLElement,attrName:string, attrValue:any,ownComponent:IComponent<any>,scope:Scope){
    let binder = binders[attrName];
    let reactive:Reactive;
    if(attrValue.$schemaType!==undefined){
        reactive = attrValue.getValueFromScope(scope,ownComponent) as Reactive;
    }else{
        if(binder){
            reactive = new ConstantReactive(attrValue);
        }
    }
    
    if(binder){
        binder(ownComponent,element,attrName,reactive);
    }else{
        let propName = attributeConvertNames[attrName] || attrName;
        element[propName] = reactive?reactive.get():attrValue;
        if(reactive)reactive.subscribe((e:IChangeEvent)=>{
            element[propName] = e.value;
        },ownComponent);
    }
}

function bindEvent(element:HTMLElement,evtName:string,handler:Function|Reactive|Schema,ownComponent:IComponent<any>,scope:Scope) {
    element[evtName] = (e)=>{
        let func : Function = handler as Function;
        if( (handler as Schema).$schemaType!==undefined ) {
            func = (handler as Schema).getValueFromScope(scope,ownComponent);
        } 
        if ( (func as any as Reactive).$reactiveType!==undefined ) 
            func = (func as any as Reactive).$reactiveValue;
        
        let statesReactive = ownComponent.$states;
        let statesData = statesReactive.get();
        let newStates= func.call(ownComponent,statesData,e);
        if(newStates===undefined) newStates=statesData;
        statesReactive.update(newStates);
    };
}
//<select><option for={{each: options, as: option }} value={option.value}>{option.text}</option></select>
function makeFor(anchorElement:any, vnode:INodeDescriptor,each:Reactive,item:Reactive,scope:Scope){

}

function buildForItem(itemSchema:Schema,item:Reactive,vnode:INodeDescriptor){}

function createTextNode(bindValue:any,ownComponent:IComponent<any>, scope :Scope):HTMLElement{
    if(!bindValue) return document.createTextNode(bindValue) as any as HTMLElement;
    let reactive :Reactive;
    if(bindValue.$schemaType!==undefined){
        scope || (scope = ownComponent?.$scope);
        if(!scope) {
            console.warn(`传入了schema,但却没有ownComponent,使用schema的defaultValue作为内容`);
            return document.createTextNode(bindValue.$schemaDefaultValue) as any as HTMLElement;
        }
        reactive = bindValue.getValueFromScope(scope,ownComponent);
    } else if (bindValue.$reactiveType!==undefined) {
        reactive = bindValue
    }
    if (reactive) {
        let node = document.createTextNode(reactive.$reactiveValue);
        let handler = (e:IChangeEvent)=>{
            node.nodeValue = e.value;
        };
        reactive.subscribe(handler);
        return node as any as HTMLElement;
    } else {
        return document.createTextNode(bindValue) as any as HTMLElement;
    }

    
}

export let binders :{[name:string]:(ownComponent:IComponent<any>,element:HTMLElement,attrName:string,reactive:Reactive)=>any}={};
binders.style = function(ownComponent:IComponent<any>,element:HTMLElement,attrName:string,reactive:Reactive):any{
    function setStyles(elem:HTMLElement,styles){
        let t = typeof styles;
        if(t==="string") {
            elem.style.cssText = styles;
        }else if(styles){
            for(let n in styles) {
                let value = styles[n];
                elem.style[n]=value;
            }
        }
    }
    reactive.subscribe((e)=>{
        setStyles(element,e.value);
    });
    setStyles(element,reactive.$reactiveValue);
    for(let n in reactive){
        let sub = reactive[n];
        if(sub instanceof Reactive)((name:string,bindValue:Reactive)=>{
            bindValue.subscribe((e:IChangeEvent)=>{
                let value = e.value;
                element.style[name]=value;
            });
        })(n,sub);
    }
};



export let componentTypes:{[tag:string]:{new():IComponent<any>}} = {};

let attributeConvertNames = {
    "class":"className"
};

export interface IYaOpts{
    element?:HTMLElement;
    name?:string;
    states?:any;
    template?:INodeDescriptor;
}
export class YA{
    $element:HTMLElement;
    $scope:Scope;
    constructor(public opts:IYaOpts){
        this.$scope = new Scope(undefined , opts.name || 'root');
        let elem = this.$element = createElement(opts.template,this as any,this.$scope, true);
        constant(false, elem,'$YA',this);
        if(opts.element) {
            opts.element.innerHTML="";
            opts.element.appendChild(elem);
        }
    }
}
let IYA:any = YA;
IYA.createNodeDescriptor = createNodeDescriptor;
IYA.localFor = localFor;
IYA.componentTypes = componentTypes;
IYA.binders = binders;
IYA.computed = computed;

export default globalThis.YA = IYA;