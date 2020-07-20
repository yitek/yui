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
    "$-subject-topics": {
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
    static mixin(target: any): any;
}
export declare enum SchemaTypes {
    value = 0,
    object = 1,
    array = 2
}
export declare class Schema {
    $schemaName: string;
    $schemaNames: string[];
    $schemaItemNames: string[];
    $ownSchema: Schema;
    $schemaDefaultValue: any;
    $arrayItemSchema: Schema;
    $schemaType: SchemaTypes;
    private "$-schema-root";
    $reactiveRootName?: string;
    constructor(defaultValue: any, ownSchema?: Schema, name?: string);
    defineProp(name: string, propDefaultValue?: any): Schema;
    asArray(dftItemValue?: any): Schema;
    getRootSchema(): Schema;
    getValueByPath(target: any): any;
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
    $ownReactive: Reactive;
    $schema: Schema;
    $reactiveType: SchemaTypes;
    constructor(ownOrValue: any, schema: Schema, name?: string);
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
export interface IComponentMeta {
    stateSchema?: Schema;
    vnode?: IVNode;
    reactives?: {
        [name: string]: Reactive;
    };
}
export interface IComponent<T> extends IDisposable {
    $meta: IComponentMeta;
    $reactives: {
        [name: string]: Reactive;
    };
    states: any;
    $ownComponent?: IComponent<any>;
    $element?: any;
    template: IVNode | {
        (states: T): any;
    };
    render?(element: HTMLElement, vm: any): HTMLElement;
    refresh(states: T): IComponent<T>;
}
export declare function enumerator<T>(arraySchema?: Schema): T;
export declare let binders: {
    [name: string]: (ownComponent: IComponent<any>, element: HTMLElement, attrName: string, reactive: Reactive) => any;
};
export declare let componentTypes: {
    [tag: string]: {
        new (): IComponent<any>;
    };
};
export interface IYuiOpts {
    element?: HTMLElement;
    states?: any;
    template?: IVNode;
}
export declare class Yui {
    opts: IYuiOpts;
    $element: HTMLElement;
    constructor(opts: IYuiOpts);
}
declare const _default: any;
export default _default;
