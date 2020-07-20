


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
    if(!obj) return false;
    return Object.prototype.toString.call(obj)==="[object Object]";
}


export function is_object(obj:any):boolean{
    if(!obj) return false;
    let t= Object.prototype.toString.call(obj) as string;
    if(t.indexOf("[object ")==0)return true;
}

export function is_array(obj:any):boolean {
    if(!obj) return false;
    return Object.prototype.toString.call(obj)==="[object Array]";
}

export function is_empty(obj:any):boolean{
    if(!obj) return true;
    let t = typeof obj;
    if(t==="function" || t==="number" || t==="boolean")return false;
    for(let n in obj) return false;
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
    if(text===null || text===undefined) return "";
    return text.toString().replace(trimreg,"");
}

let percentRegx = /([+-]?[\d,]+(?:.\d+))%/g;

/**
 * 是否是百分数
 *
 * @export
 * @param {*} text
 * @returns {number}
 */
export function  is_percent(text:any):number {
    if(text===null || text===undefined) return undefined;
    let match = text.toString().match(percentRegx);
    if(match)return match[1];
}

/////////////////////
// 数组处理


export function array_index(obj:any,item:any,start:number=0):number {
    if(!obj) return -1;
    for(let i = start,j=obj.length;i<j;i++) {
        if(obj[i]===item) return i;
    }
    return -1;
}
export function array_contains(obj:any,item:any):boolean {
    return array_index(obj,item)>=0;
}
export function array_add_unique(arr:any[],item:any):boolean{
    if(!arr || !arr.push) return false;
    for(let i = 0,j=arr.length;i<j;i++) {
        if(arr[i]===item) return false;
    }
    arr.push(item);
    return true;
}
export function array_remove(arr:any[],item:any):boolean{
    if(!arr || !arr.push || !arr.shift) return false;
    let hasItem = false;
    for(let i = 0,j=arr.length;i<j;i++) {
        let existed = arr.shift();
        if(existed!==item) arr.push(existed);
        else hasItem = true;
    }
    return hasItem;
}
///////////////////////////////////////
// 对象处理


export let extend :(...args)=>any= function (){
    let target = arguments[0] ||{};
    for(let i =1,j=arguments.length;i<j;i++){
        let o = arguments[i];
        if(o) for(let n in o) target[n] = o[n];
    }
    return target;
}



function implicit(target?,members?){
    function _implicit(target,name?,value?){
        if(name===undefined){
            target = target.prototype||target;
            for(let n in target) Object.defineProperty(target,n,{enumerable:false,writable:true,configurable:true,value:value===undefined?target[n]:value});
        }
        Object.defineProperty(target,name,{enumerable:false,writable:true,configurable:true,value:value===undefined?target[name]:value});
    }
    //作为装饰器工厂调用
    if(target===undefined)return _implicit;
    //将整个对象成员变成不可枚举
    if(!members){
        for(let n in target) Object.defineProperty(target,n,{enumerable:false,writable:true,configurable:true,value:target[n]});
        return;
    }
    //指定成员对象，noenumerable(obj,['a','b'])
    if(is_array(members)){
        for(const name of members)  Object.defineProperty(target,name,{enumerable:false,configurable:true,writable:true,value:target[name]});
        return;
    }
    for(let n in members)  Object.defineProperty(target,n,{enumerable:false,configurable:true,writable:true,value:members[n]});
    
}

let cidSeeds:{[name:string]:number}={};
function cid(name?:string):string{
    if(name===undefined) name = "cid";
    let seed = cidSeeds[name];
    if(seed===undefined) seed = cidSeeds[name]=0;
    if(++seed>2100000000){
        seed = -2100000000;
        cidSeeds[name] = seed;
    } 
    return `${name}!{seed}`;
}

////////////////////////////////////////////////////////////////////////////////////
//
// Fulfill
//
export enum FulfillStates{
    padding,
    fulfilled,
    rejected
}
export class IFulfill{
    "$-fullfill-status":FulfillStates;
    "$-fullfill-value":any;
}




export interface IDisposable{
    dispose(listenerOrEvent?:any):IDisposable;
}

export function disposable(obj):IDisposable{
    obj.dispose = function(handler?):IDisposable{
        let disposeHandlers = this["$-dispose-handlers"];
        if(disposeHandlers===null) throw new Error("已经被释放，不能再调用dispose");
        
        if(handler===undefined){
            
            this["$-dispose-handlers"]=null;
            if(disposeHandlers) for(const dHandler of disposeHandlers){
                dHandler.call(this);
            }
        }else{
            if(disposeHandlers===undefined){
                Object.defineProperty(this,"$-dispose-handlers",{enumerable:false,configurable:true,writable:true,value:disposeHandlers=[]});
            }
            disposeHandlers.push(handler);
        }
        return this;
    }
    return obj;
}

export class Subect{
    "$-subject-topics":{[topic:string]:{(...args:any[]):any}[]};
    subscribe(topic:string|{(...evt:any[]):any},listener?:{(...evts:any[]):any}|IDisposable,refObject?:IDisposable):Subect{
        if(listener===undefined){
            listener = topic as (...evts:any[])=>any;
            topic = "";
            refObject = undefined;
        } else if((listener as IDisposable).dispose){
            refObject = listener as IDisposable;
            listener = topic as {(...evt:any[]):any};
            topic ="";
        }
        if(typeof listener!=="function") throw new Error(`subject的lisntener必须是函数`);
        let topics = this["$-subject-topics"];
        if(!topics) Object.defineProperty(this,"$-subject-topics",{enumerable:false,writable:false,configurable:false,value:topics=this["$-subject-topics"]={}});
        let listeners = topics[topic as string] || (topics[topic as string]=[]);
        listeners.push(listener as (...evts:any[])=>any);
        if(refObject){
            refObject.dispose(()=>{
                array_remove(listeners,listener);
            });
        }
        return this;
    }
    unsubscribe(topic:string|{(evt:any):any},listener:{(evt:any):any}):Subect{
        if(listener===undefined){
            listener = topic as (...evt:any[])=>any;
            topic = "";
        }
        let topics = this["$-subject-topics"];
        if(topics){
            let listeners = topics[topic as string];
            array_remove(listeners,listener);
        }       
        
        return this;
    }

    notify(topic:any,evt?,...evts:any[]):Subect{
        let topics = this["$-subject-topics"];
        if(!topics)return this;
        let listeners,ckIndex;
        if(typeof topic !=="string"){
            listeners = topics[""] ;
            ckIndex = 1;
        }else{
            listeners = topics[topic as string];
            ckIndex=2;
        }
        if(!listeners) return this;
                
        let args,useApply;
        if(arguments[ckIndex]!==undefined){
            args=[];useApply =true;
            for(let i = 0,j=arguments.length;i<j;i++) args.push(arguments[i]);
        }else args = arguments[ckIndex-1];

        for(let i =0,j=listeners.length;i<j;i++){
            let handler = listeners[i];
            if(useApply) handler.apply(this,args);else handler.call(this,args);
        }
        return this;
    }
    static mixin(target):any{
        for(let n in Subect.prototype) target[n] = Subect.prototype[n];
        return target;
    }
}

export enum SchemaTypes{
    value,object,array
}
@implicit()
export class Schema{
    $schemaName:string;
    $schemaNames:string[];
    $schemaItemNames:string[];
    $ownSchema:Schema;
    $schemaDefaultValue:any;
    $arrayItemSchema:Schema;
    $schemaType:SchemaTypes;
    private "$-schema-root":Schema;
    $reactiveRootName?:string;
    constructor(defaultValue,ownSchema?:Schema,name?:string){
        if(defaultValue===Schema) return;
        if(defaultValue && defaultValue.$schemaType!==undefined) defaultValue= defaultValue.$schemaDefaultValue;
        let names:string[]=[];
        if(ownSchema) {
            for(const n of ownSchema.$schemaNames) names.push(n);
            names.push(name);

        }
        
        implicit(this,{
            "$ownSchema":ownSchema,
            "$schemaName" : name,
            "$schemaDefaultValue":defaultValue,
            "$schemaType":SchemaTypes.value,
            "$schemaNames":names,
            "$-schema-root":undefined,
            "$reactiveRootName":undefined
        });

        
        let t = typeof defaultValue;
        if(t==="object"){
            if(is_array(defaultValue)){
                this.asArray(defaultValue[0]);
            }else {
                for(let n in defaultValue){
                    this.defineProp(n,defaultValue[n]);
                }
            }
        }
    }
    defineProp(name:string,propDefaultValue?):Schema{
        if(this.$schemaType===SchemaTypes.value) {
            this.$schemaType = SchemaTypes.object;
            if(this.$schemaDefaultValue===undefined)this.$schemaDefaultValue = {};
        }else if(this.$schemaType===SchemaTypes.array){
            throw new Error(`已经是array了，不可以再定义属性`);
        }
        if(propDefaultValue===undefined){
            propDefaultValue = this.$schemaDefaultValue?this.$schemaDefaultValue[name]:undefined;
        }
        let propSchema = new Schema(propDefaultValue,this,name);
        this[name] = propSchema;
        return propSchema;
    }
    asArray(dftItemValue?:any):Schema{
        if(this.$arrayItemSchema && dftItemValue===undefined)return this.$arrayItemSchema;
        if(this.$schemaType!==SchemaTypes.value){
            throw new Error(`已经是array/object了，不可以再定义item`);
        }
        this.$schemaType = SchemaTypes.array;
        let  itemSchema =  new Schema(dftItemValue,this);
        Object.defineProperty(this,"$arrayItemSchema",{value:itemSchema,writable:true,enumerable:false,configurable:false});
        let lengthSchema = new Schema(0,this,"length");
        Object.defineProperty(this,"length",{value:lengthSchema,enumerable:false,writable:true,configurable:false});
        return itemSchema;
    }

    getRootSchema():Schema{
        let root = this["$-schema-root"];
        if(!root){
            root = this;
            while(root.$ownSchema){
                root = root.$ownSchema;
            }
            this["$-schema-root"] = root;
        }
        return root;
    }

    getValueByPath(target):any{
        let names = this.$schemaNames;
        let value = target;
        for(const name of names) {
            value = value[name];
            if(value===undefined) return value;
        }
        return value;
    }
    
    createReactive(ownOrValue?):Reactive{
        return new Reactive(ownOrValue,this);
    }
}

export interface IChangeItem{
    index:number;
    value:any;
    reactive:Reactive;
}

export interface IChangeEvent{
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
export class Reactive extends Subect{
    $reactiveName:string;
    $reactiveValue:any;
    $ownReactive:Reactive;
    $schema:Schema;
    $reactiveType:SchemaTypes;
    
    constructor(ownOrValue:any,schema:Schema,name?:string){
        super();
        
        name = name===undefined?schema?.$schemaName:name;
        let own:Reactive,value;
        if(ownOrValue instanceof Reactive){
            own = ownOrValue;
            let ownValue = own.$reactiveValue;
            if(ownValue) value = ownValue[name];
        }else if(ownOrValue!==Reactive) {
            value = ownOrValue;
        }
        if(value===undefined && schema) value = schema.$schemaDefaultValue;
        implicit(this,{
            "$reactiveName":name,
            "$schema":schema,
            "$ownReactive":own,
            "$reactiveType":schema?schema.$schemaType:SchemaTypes.value,
            "$reactiveValue":value
        });
        if(ownOrValue===Reactive) return;
        if(schema.$schemaType===SchemaTypes.object){
            if(typeof value!=="object") value = {};
            Object.defineProperty(this,"$reactiveValue",{enumerable:false,writable:true,configurable:true,value:value});
            for(let n in schema){
                let fc = n[0];
                if(n==="constructor" || fc==="$" || fc==="_" || fc==="-") continue;
                let subReacitve = new Reactive(this,schema[n],n);
                this[n] = subReacitve;
            }
            
        }else if(schema.$schemaType===SchemaTypes.array){
            if(typeof value!=="object") value = [];
            Object.defineProperty(this,"$reactiveValue",{enumerable:false,writable:true,configurable:true,value:value});
            for(let i = 0,j=value.length;i<j;i++){
                let itemReacitve = new Reactive(this,schema.$arrayItemSchema,i as any as string);
                this[i] = itemReacitve;
            }
            for(let n in schema){
                if(!/^\d+$/.test(n))continue;
                if(!this[n]){
                    let itemReacitve = new Reactive(this,schema.$arrayItemSchema,n);
                    this[n] = itemReacitve;
                }
                
            }
            let lengthReactive =new Reactive(this,(schema as any).length);
            Object.defineProperty(this,"length",{configurable:false,writable:true,enumerable:false,value:lengthReactive});
            
        }else{
            Object.defineProperty(this,"$reactiveValue",{enumerable:false,writable:true,configurable:true,value:value});
        }
    }
    update(value,src?):Reactive{
        let schemaType = this.$schema.$schemaType; 
        if(schemaType===SchemaTypes.object){
           updateObject(this,value,src);       
        }else if(schemaType===SchemaTypes.array){
            updateArray(this,value,src);
        }else {
            let old = this.$reactiveValue;
            if(value===old)return this;
            this.$reactiveValue=value;
            if(this.$ownReactive){
                this.$ownReactive.$reactiveValue[this.$reactiveName] = value;
            }
            this.notify("",{
                value:value,old:old,src:src||this,sender:this
            });
        }
        return this;
    }
    get():any{
        let schemaType = this.$schema.$schemaType;
        if(schemaType === SchemaTypes.object){
            let result:any = {};
            for(let n in this){
                let reactive = this[n];
                if(reactive instanceof Reactive)  result[n] = reactive.get();
            }
            return result;
        }else if(schemaType === SchemaTypes.array){
            let result = [];
            for(let n in this){
                let reactive = this[n];
                if(n!=="length" && reactive instanceof Reactive) result.push(reactive.get());
            }
            return result;
        }else{
            return this.$reactiveValue;
        }
    }
}

@implicit()
export class ConstantReactive extends Reactive{
    constructor(value:any,name?:string){
        super(Reactive,undefined);
        this.$reactiveValue=value;
        this.$reactiveName =name;
    }
    subscribe(topic,listener?,refObj?):ConstantReactive{
        return this;
    }
    unsubscribe(topic,listener?):ConstantReactive{
        return this;
    }
    notify(...args:any[]):ConstantReactive{
        return this;
    }
    get():any{return this.$reactiveValue;}
    update(value):ConstantReactive{
        console.warn(`在ConstantReactive上调用了update操作,忽略。`,this,value);
        return this;
    }

}

function updateObject(reactive:Reactive,value,src){
    let old = reactive.$reactiveValue;
    value ||(value={});
    reactive.$reactiveValue=value;
    if(reactive.$ownReactive){
        reactive.$ownReactive.$reactiveValue[reactive.$reactiveName] = value;
    }
    let event :IChangeEvent= {
        value:value,old:old,sender:reactive,src:src||reactive
    };
    if(old!==value){
        reactive.notify(event);
        if(event.cancel) return reactive;
    }
    
    let keys = Object.keys(value);
    for(const n of keys){
        let propReacitve = reactive[n];
        if(propReacitve instanceof Reactive){
            propReacitve.update(value[n],event);
        }
    }
    return reactive;  
}

function updateArray(reactive:Reactive,value,src){
    let old = reactive.$reactiveValue;
    value ||(value=[]);
    reactive.$reactiveValue=value;
    if(reactive.$ownReactive){
        reactive.$ownReactive.$reactiveValue[reactive.$reactiveName] = value;
    }
    let event :IArrayChangeEvent= {
        value:value,old:old,src:src||reactive,sender:reactive
    };
    
    let lengthReactive = (reactive as any).length as Reactive;
    let oldLength = lengthReactive.$reactiveValue;
    let newLength = value.length;
    let appends:IChangeItem[] = [];
    let removes:IChangeItem[] = [];
    let updates:IChangeItem[] = [];
    for(let i =0,j=oldLength;i<j;i++){
        let existsReactive = reactive[i] as Reactive;
        let changeItem = {index:i,value:value[i],reactive:existsReactive};
        if(i<newLength){
            updates.push(changeItem);
        }else {
            removes.push(changeItem);
            delete reactive[i as any as string];
        }
    }
    for(let i=oldLength,j=newLength-oldLength;i<j;i++){
        let newItemReactive = new Reactive(reactive,reactive.$schema.$arrayItemSchema,i);
        Object.defineProperty(reactive,i as any as string,{value:newItemReactive});
        appends.push({value:value[i],reactive:newItemReactive,index:i});

    }
    event.appends=appends.length?appends:null;
    event.removes = removes.length?removes:null;
    event.updates = updates.length?updates:null;
    if(value!==old || appends.length || removes.length){
        reactive.notify(event);
        if(event.cancel) return reactive;
    }
    for(const item of updates){
        item.reactive.update(item.value,event);
    }
}

///////////////////////////////////////////////////////////////////////////
//VNode
export interface IVNode{
    tag?:string,
    component?:{new():IComponent<any>};
    attrs?:{[name:string]:any},
    content?:string;
    children?:IVNode[];
}
function _createVNode(tag:string|{new()},attrs:string|{[name:string]:any}):IVNode{
    let vnode :IVNode={};
    let tagType = typeof tag;
    if(tagType==="string") vnode.tag = tag as string;
    else if(tagType==="function") vnode.component=  tag as {new()}; 
    else {vnode.content= attrs as string;return vnode;}
    vnode.attrs = attrs as {[name:string]:any};
    let children :IVNode[];
    for(let i = 2;i<arguments.length;i++){
        let child = arguments[i];
        if(!children) children=[];
        if(typeof child==="string") children.push({content:child});
        else children.push(child);
    }
    vnode.children = children;
    return vnode;
}
export let createVNode :(tag:string|{new()},attrs:string|{[name:string]:any},...args:any[])=>IVNode = _createVNode;
globalThis.createVNode = createVNode;

////////////////////////////
// component

export interface IComponentMeta{
    stateSchema?:Schema;
    vnode?:IVNode;
    reactives?:{[name:string]:Reactive};
}
export interface IComponent<T> extends IDisposable{
    $meta:IComponentMeta;
    $reactives:{[name:string]:Reactive};
    states:any;
    $ownComponent?:IComponent<any>;
    $element?:any;
    template:IVNode|{(states:T):any};
    render?(element:HTMLElement,vm:any):HTMLElement;
    refresh(states:T):IComponent<T>;
}
declare let Proxy;
let proxyHandlers = {
    get:function(obj:Schema,name:string){
        if(name==="$-schema-proxy-raw") return obj;
        let value = obj[name];
        if(value===undefined) return createSchemaProxy(obj.defineProp(name));
        let ch = name[0];
        if(ch==="$" || ch==="_" || ch==="-") return value;
        if(value instanceof Schema) return createSchemaProxy(value);
        return value;
    }
    
};
function createSchemaProxy(schema,defaultValue?){
    if(defaultValue!==undefined) schema.$schemaDefaultValue= defaultValue;
    return new Proxy(schema,proxyHandlers);
}

let renderStack:{[name:string]:Schema}[]=[];

export function enumerator<T>(arraySchema?:Schema):T{
    if(arraySchema) return arraySchema.asArray() as any as T;
    let context = renderStack.pop();
    renderStack.push(context);
}

function buildUI(vnode:IVNode ,ownComponent:IComponent<any>):HTMLElement{
         
    let componentType;
    if(vnode.tag) {
        componentType = componentTypes[vnode.tag];
    }else componentType = vnode.component;
    if(componentType){
        return buildComponent(componentType,vnode.attrs,vnode.children,ownComponent);
    }else{
        if(vnode.tag)
            return buildElement(vnode.tag,vnode.attrs,vnode.children,ownComponent);
        else return buildText(vnode.content,ownComponent);
    }
}

function buildComponent(compoentType:{new():IComponent<any>},vm:{[name:string]:any},children:IVNode[],ownComponent:IComponent<any>):HTMLElement{
    let component = createComponent(compoentType,ownComponent,vm);
    let elem = component.$element = buildUI(component.$meta.vnode,component);
    if(component.render) {
        let newElem = component.render(elem,vm);
        if(newElem)elem = newElem;
    }
    Object.defineProperty(elem,"$-yui-component",{value:component});
    return elem;
}
function createComponent(componentType:{new():IComponent<any>},ownComponent:IComponent<any>,vm:{[name:string]:any}):IComponent<any>{
    let component = new componentType();
    if(!component.dispose){disposable(component);}
    component.$ownComponent = ownComponent;
    sureComponentMeta(component,componentType,vm);
    let states = component.$meta.stateSchema.createReactive();
    component.$reactives={"":states};

   
    return component;
}
function sureComponentMeta(component:IComponent<any>,componentType:{new():IComponent<any>},vm:{[name:string]:any}):IComponentMeta{
    let meta = componentType.prototype.$meta ||(componentType.prototype.$meta={reactives:{}});
    let vnode = meta.vnode;
    if(vnode===undefined){
        let schema = meta.stateSchema;
        if(!schema) schema = meta.stateSchema = new Schema(undefined);
        schema.$reactiveRootName="";
        let proxy = createSchemaProxy(schema,vm);
        
        vnode = meta.vnode = typeof component.template==="function"?component.template(proxy):component.template;
    }
    return meta;
}
function bindComponentStates(component:IComponent<any>,attrs:{[name:string]:any}){
    let states = component.$reactives[""];
    let ownReactives = component.$ownComponent?.$reactives;
    for(let attrName in attrs)(function(attrName:string,bindValue,states:Reactive){
        if(bindValue && bindValue["$-schema-proxy-raw"]) bindValue = bindValue["$-schema-proxy-raw"];
        let vmProp = states[attrName] as Reactive;
        if(!vmProp){
            debugger;
            let bindVal= bindValue?(bindValue.$reactiveType!==undefined?bindValue.$reactiveValue:bindValue):bindValue;
            vmProp = states[attrName] = new ConstantReactive(bindVal,attrName);
        }
        
        if(bindValue instanceof Schema){
            let bindValueReactive = bindValue.getValueByPath(ownReactives[bindValue.getRootSchema().$reactiveRootName]) as Reactive;
            let handler = (e:IChangeEvent)=>{
                let propReactive = (states as any)[attrName];
                if(propReactive instanceof Reactive){
                    propReactive.update(e.value);
                }
            };
            //外面的变化后，触发里面的变化
            bindValueReactive.subscribe(handler,component);
        }else vmProp.$reactiveValue = bindValue;
    })(attrName,attrs[attrName],states);
}

let eventNameRegx = /^on/g;
function buildElement(tag:string,attrs:{[name:string]:any},children:IVNode[],ownComponent:IComponent<any>):HTMLElement{
    let states:{[name:string]:Reactive} = ownComponent.$reactives;
    let elem = document.createElement(tag);
    for(let attrName  in attrs){
        let attrValue = attrs[attrName];
        //将代理去掉，获取原始的schema
        if(attrValue && attrValue["$-schema-proxy-raw"]) attrValue = attrValue["$-schema-proxy-raw"];
        
        let binder = binders[attrName];
        let state:Reactive;
        if(attrValue.$schemaType!==undefined){
            let rootSchema = attrValue.getRootSchema();
            let rootState = states[rootSchema.$reactiveRootName];
            state = attrValue.getValueByPath(rootState) as Reactive;
        }else{
            if(binder){
                state = new ConstantReactive(attrValue);
            }
        }
        if(eventNameRegx.test(attrName) && elem[attrName]===null ){
            bindEvent(elem,attrName,state||attrValue,ownComponent);
            break;
        }
        if(binder){
            binder(ownComponent,elem,attrName,state);
        }else{
            let propName = attributeConvertNames[attrName]|| attrName;
            elem[propName] = state?state.get():attrValue;
            if(state)state.subscribe((e:IChangeEvent)=>{
                elem[propName] = e.value;
            },ownComponent);
        }
    }
    if(children)for(const child of children){
        let childElement :HTMLElement;
        if(!child) continue;
        if(child["$-schema-proxy-raw"]) {
            let c = child["$-schema-proxy-raw"];
            childElement = buildText(c,ownComponent);
        }else if((child as Schema).$schemaType!==undefined){
            childElement = buildText(child as Schema,ownComponent);
        }else if(child.component){
            childElement = buildComponent(child.component,child.attrs,children,ownComponent);
        }else {
            childElement = buildUI(child,ownComponent);
        }
        
        elem.appendChild(childElement);
    }
    return elem;
}
function bindEvent(element:HTMLElement,evtName:string,handler:Function|Reactive,ownComponent:IComponent<any>){
    element[evtName] = (e)=>{
        let statesReactive = ownComponent.$reactives[""];
        let states = statesReactive.get();
        let evtHandler:Function = (handler as Reactive).$reactiveValue||handler;
        let newStates= evtHandler.call(ownComponent,states,e);
        if(newStates===undefined) newStates=states;
        statesReactive.update(newStates);
    };
}

function buildText(bindValue:any,ownComponent:IComponent<any>):HTMLElement{
    if(bindValue && bindValue.$schemaType!==undefined){
        let root = bindValue.getRootSchema();
        let rootReactive = ownComponent.$reactives[root.$reactiveRootName];
        let reactive = bindValue.getValueByPath(rootReactive) as Reactive;
        let node = document.createTextNode(reactive.$reactiveValue);
        let handler = (e:IChangeEvent)=>{
            node.nodeValue = e.value;
        };
        reactive.subscribe(handler);
        return node as any as HTMLElement;
    }else {
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

export interface IYuiOpts{
    element?:HTMLElement;
    states?:any;
    template?:IVNode;
}
export class Yui{
    $element:HTMLElement;
    constructor(public opts:IYuiOpts){
        debugger;
        let elem = this.$element = buildUI(opts.template,this as any);
        Object.defineProperty(elem,"$yui",{enumerable:false,writable:true,configurable:true,value:this});
        if(opts.element) {
            opts.element.innerHTML="";
            opts.element.appendChild(elem);
        }
    }
}
let YUI:any = Yui;
YUI.createVNode = createVNode;
YUI.componentTypes = componentTypes;
YUI.binders = binders;

export default globalThis.Yui = YUI;