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
export declare enum FulfillStates {
    padding = 0,
    fulfilled = 1,
    rejected = 2
}
export declare class IFulfill {
    "$-fullfill-status": FulfillStates;
    "$-fullfill-value": any;
}
export interface IDisposable {
    dispose(listenerOrEvent?: any): IDisposable;
}
export declare function disposable(obj: any): IDisposable;
export declare class Subect {
    '$-subject-topics': {
        [topic: string]: {
            (...args: any[]): any;
        }[];
    };
    subscribe(topic: string | {
        (...evt: any[]): any;
    }, listener?: {
        (...evts: any[]): any;
    } | IDisposable, refObject?: IDisposable): Subect;
    unsubscribe(topic: string | {
        (evt: any): any;
    }, listener: {
        (evt: any): any;
    }): Subect;
    notify(topic: any, evt?: any, ...evts: any[]): Subect;
}
export declare enum SchemaTypes {
    value = 0,
    object = 1,
    array = 2
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
    getValueFromScope(scope: Scope): any;
    createReactive(ownOrValue?: any): Reactive;
}
export interface IChangeItem {
    index: number;
    value: any;
    reactive: Reactive;
}
export interface IChangeEvent {
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
export declare class Reactive extends Subect {
    $reactiveName: string;
    $reactiveValue: any;
    $reactiveOwn: Reactive;
    $reactiveSchema: Schema;
    $reactiveType: SchemaTypes;
    $reactiveScope?: Scope;
    constructor(ownOrValue: any, schema: Schema, name?: string, scope?: Scope);
    update(value: any, src?: any): Reactive;
    get(): any;
}
export declare class ConstantReactive extends Reactive {
    constructor(value: any, name?: string);
    subscribe(topic: any, listener?: any, refObj?: any): ConstantReactive;
    unsubscribe(topic: any, listener?: any): ConstantReactive;
    notify(...args: any[]): ConstantReactive;
    get(): any;
    update(value: any): ConstantReactive;
}
export declare class Scope {
    '$-scope-root'?: Scope;
    '$-scope-parent': Scope;
    constructor(parent?: Scope);
    reactive(name: string, schema: Schema, initValue?: any): Reactive;
    get(name: string): Reactive;
    createScope(): Scope;
    rootScope(): Scope;
}
export interface IVNode {
    tag?: string;
    component?: {
        new (): IComponent<any>;
    };
    attrs?: {
        [name: string]: any;
    };
    content?: string;
    children?: IVNode[];
}
export declare let createVNode: (tag: string | {
    new (): any;
}, attrs: string | {
    [name: string]: any;
}, ...args: any[]) => IVNode;
export declare type TStatesSchemaBuilder = (builder: (statesSchema: Schema) => any) => any;
export declare type TComponentCtor = {
    new (statesSchemaBuilder?: TStatesSchemaBuilder): IComponent<any>;
};
export declare type TTemplateFunc = (states: any, statesSchemaBuilder?: TStatesSchemaBuilder) => any;
export declare type TComponentFunc = TComponentCtor | TTemplateFunc;
export interface IComponentMeta {
    tag?: string;
    vnode?: IVNode;
    statesSchema?: Schema;
    localSchemas?: {
        [name: string]: Schema;
    };
}
export interface IComponent<T> extends IDisposable {
    $meta: IComponentMeta;
    $cid: string;
    $tag?: string;
    $scope: Scope;
    $states: Reactive;
    $ownComponent?: IComponent<any>;
    $element?: any;
    template: IVNode | TTemplateFunc;
    render?(element: HTMLElement, vm: any): HTMLElement;
    refresh(states: T): IComponent<T>;
}
export declare function local<T>(localSchema?: Schema): T;
export declare function localFor<T>(schema: Schema): T;
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
    states?: any;
    template?: IVNode;
}
export declare class YA {
    opts: IYaOpts;
    $element: HTMLElement;
    constructor(opts: IYaOpts);
}
declare const _default: any;
export default _default;
