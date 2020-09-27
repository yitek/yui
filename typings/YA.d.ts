export declare function is_string(obj: any): boolean;
export declare function is_bool(obj: any): boolean;
export declare function is_number(obj: any): boolean;
export declare function is_assoc(obj: any): boolean;
export declare function is_object(obj: any): boolean;
export declare function is_array(obj: any): boolean;
export declare function is_empty(obj: any): boolean;
/**
 *  去掉两边空格
 *
 * @export
 * @param {*} text
 * @returns {string}
 */
export declare function trim(text: any): string;
/**
 * 判定字符串是否以某个串开始
 *
 * @export
 * @param {*} text 要判定的字符串
 * @param {*} token 开始标记字符串
 * @returns {boolean}
 */
export declare function startWith(text: any, token: any): boolean;
/**
 * 判定字符串是否以某个串结束
 *
 * @export
 * @param {*} text 要检测的字符串
 * @param {*} token 结束标记字符串
 * @returns {boolean}
 */
export declare function endWith(text: any, token: any): boolean;
/**
 * 是否是百分数
 *
 * @export
 * @param {*} text
 * @returns {number}
 */
export declare function is_percent(text: any): number;
export declare function array_index(obj: any, item: any, start?: number): number;
export declare function array_contains(obj: any, item: any): boolean;
export declare function array_add_unique(arr: any[], item: any): boolean;
export declare function array_remove(arr: any[], item: any): boolean;
export declare function deepClone(obj: any, _clones?: any[]): any;
export declare let extend: (...args: any[]) => any;
export declare function accessable(desc: any, target?: any, name?: any, value?: any): any;
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
export declare function implicit(target?: any, name?: any, value?: any): any;
export declare function constant(enumerable?: boolean, target?: any, name?: any, value?: any): any;
export declare class Exception extends Error {
    constructor(message: string, infos?: {
        [name: string]: any;
    });
}
export interface IThenable<T> {
    then(fulfilled: (value: any) => any, rejected: (err: any) => any): IThenable<T>;
}
export declare class Thenable<T> implements IThenable<T> {
    constructor(process: (resolve: (value: any) => any, reject: (value: any) => any) => any);
    then(resolve: any, reject: any): Thenable<any>;
    static isThenable(obj: any): boolean;
}
export interface IDisposable {
    dispose(listenerOrEvent?: any): IDisposable;
}
export declare function disposable(obj: any): IDisposable;
export declare class Disposable implements IDisposable {
    dispose(handler?: any): Disposable;
}
export declare class Subject extends Disposable {
    '$-subject-topics': {
        [topic: string]: {
            (...args: any[]): any;
        }[];
    };
    subscribe(topic: string | {
        (...evt: any[]): any;
    }, listener?: {
        (...evts: any[]): any;
    } | IDisposable, refObject?: IDisposable): Subject;
    unsubscribe(topic: string | {
        (evt: any): any;
    }, listener: {
        (evt: any): any;
    }): Subject;
    notify(topic: any, evt?: any, ...evts: any[]): Subject;
    dispose(handler?: any): Subject;
}
export declare enum SchemaTypes {
    value = 0,
    object = 1,
    array = 2,
    constant = 3,
    computed = 4
}
export declare class Schema {
    $schemaName: string;
    private '$-schema-root';
    private '$-schema-name-paths-from-root';
    /**
     * 在作用域上的名字
     * 如果为空，表示不是作用域变量
     * 如果该字段有值，表示该Schema的变量将会从scope上面去取
     *
     * @type {string}
     * @memberof Schema
     */
    $schemaScopedName?: string;
    private '$-schema-scoped';
    private '$-schema-name-paths-from-scoped';
    $schemaOwn: Schema;
    $schemaDefaultValue: any;
    $schemaArrayItem: Schema;
    $schemaType: SchemaTypes;
    constructor(defaultValue: any, ownSchema?: Schema, name?: string);
    defineProp(name: string, propDefaultValue?: any): Schema;
    asObject(dftValue?: any): Schema;
    asArray(dftItemValue?: any): Schema;
    getRootSchema(): Schema;
    getNamePaths(): string[];
    getValueFromRoot(target: any): any;
    getScopedSchema(): Schema;
    getScopedNamePaths(): string[];
    getValueFromScope(scope: Scope, schema?: Schema | IDisposable, initValue?: any, onlyCheckCurrentScope?: boolean): any;
    createReactive(ownOrValue?: any): Reactive;
}
export declare class ComputedSchema {
    $schemaType: SchemaTypes;
    $schemaFunc: Function;
    $schemaDependences: Schema[];
    constructor(func: Function, deps: Schema[]);
    getValueFromScope(scope: Scope, own?: IDisposable): ComputedReactive;
}
export declare function computed(): ComputedSchema;
export declare class ComputedReactive extends Subject {
    $reactiveType: SchemaTypes;
    $reactiveDependences: Reactive[];
    $reactiveSchema: ComputedSchema;
    $reactiveScope: Scope;
    $reactiveValue: any;
    constructor(schema: ComputedSchema, scope: Scope, own?: IDisposable);
    get(src?: any): any;
}
export interface IChangeItem {
    index: number;
    value: any;
    reactive: Reactive;
}
export declare enum ChangeEventTypes {
    notify = 0,
    setted = 1,
    bubbled = 2,
    appended = 3,
    removed = 4
}
export interface IChangeEvent {
    type: ChangeEventTypes;
    value: any;
    old?: any;
    src?: any;
    cancel?: boolean;
    sender?: Reactive;
}
export interface IArrayChangeEvent extends IChangeEvent {
    removes?: IChangeItem[];
    updates?: IChangeItem[];
    appends?: IChangeItem[];
}
export declare class Reactive extends Subject {
    $reactiveName: string;
    $reactiveValue: any;
    $reactiveOwn: Reactive;
    $reactiveSchema: Schema;
    $reactiveType: SchemaTypes;
    $reactiveScope?: Scope;
    constructor(ownOrValue: any, schema: Schema, name?: string, scope?: Scope);
    update(value: any, src?: any, bubble?: boolean): boolean;
    get(): any;
    notify(evt: any, bubble?: boolean): Reactive;
}
export declare class ConstantReactive extends Reactive {
    constructor(value: any, name?: string);
    subscribe(topic: any, listener?: any, refObj?: any): ConstantReactive;
    unsubscribe(topic: any, listener?: any): ConstantReactive;
    notify(...args: any[]): ConstantReactive;
    get(): any;
    update(value: any): boolean;
}
export declare class Scope {
    '$-scope-root'?: Scope;
    '$-scope-parent': Scope;
    '$-scope-name': string;
    constructor(parent?: Scope, name?: string);
    reactive(name: string, schema: Schema, initValue?: any, onlyCheckCurrentScope?: boolean): Reactive;
    createScope(name?: string): Scope;
    rootScope(): Scope;
    dispose(): void;
}
export interface INodeDescriptor {
    tag?: string;
    component?: {
        new (): IComponent<any>;
    };
    attrs?: {
        [name: string]: any;
    };
    content?: string;
    children?: INodeDescriptor[];
}
export declare let createNodeDescriptor: (tag: string | {
    new (): any;
}, attrs: string | {
    [name: string]: any;
}, ...args: any[]) => INodeDescriptor;
export declare type TStatesSchemaBuilder = (builder: (statesSchema: Schema) => any) => any;
export declare type TComponentCtor = {
    new (statesSchemaBuilder?: TStatesSchemaBuilder): IComponent<any>;
};
export declare type TTemplateFunc = (states: any, statesSchemaBuilder?: TStatesSchemaBuilder) => any;
export declare type TComponentFunc = TComponentCtor | TTemplateFunc;
export interface IComponentMeta {
    tag?: string;
    vnode?: INodeDescriptor;
    statesSchema?: Schema;
    localSchemas?: {
        [name: string]: Schema;
    };
}
interface ISlotInfo {
    placeholder: HTMLElement;
    map: {
        [name: string]: Reactive;
    };
}
export interface IComponent<T> extends IDisposable {
    $meta: IComponentMeta;
    $cid: string;
    $tag?: string;
    $scope: Scope;
    $states: Reactive;
    $slots: {
        [name: string]: ISlotInfo;
    };
    $slotMap: {
        [name: string]: Schema;
    };
    $ownComponent?: IComponent<any>;
    $element?: any;
    template: INodeDescriptor | TTemplateFunc;
    render?(element: HTMLElement, vm: any): HTMLElement;
    refresh(states: T): IComponent<T>;
}
export declare function local<T>(localSchema?: Schema, name?: string): T;
export declare function localFor<T>(schema: Schema, name?: string): T;
export declare let binders: {
    [name: string]: (ownComponent: IComponent<any>, element: HTMLElement, attrName: string, reactive: Reactive) => any;
};
export declare let componentTypes: {
    [tag: string]: {
        new (): IComponent<any>;
    };
};
export interface IYaOpts {
    element?: HTMLElement;
    name?: string;
    states?: any;
    template?: INodeDescriptor;
}
export declare class YA {
    opts: IYaOpts;
    $element: HTMLElement;
    $scope: Scope;
    constructor(opts: IYaOpts);
}
declare const _default: any;
export default _default;
