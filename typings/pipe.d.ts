interface IPipeInfo {
    handler: (input: any, states: any, pipe: Pipe, nextInfo: IPipeInfo, resolve: any, reject: any) => void;
    raw: (input: any, states: any, pipe: Pipe) => any;
    next?: IPipeInfo;
}
export declare class Pipe {
    head: IPipeInfo;
    tail: IPipeInfo;
    length: number;
    constructor();
    pipe(name: any, handler?: (input: any, states: any, pipe: Pipe) => any): Pipe;
    pump(value: any, states?: any): any;
}
export declare class PipeBreak {
    value: any;
    constructor(value: any);
}
export {};
