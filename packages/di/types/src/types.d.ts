export declare type Constructor = (...args: any[]) => any;
export declare type ConstructorTuple = [Constructor, ...string[]];
export declare type API = {
    readonly add: (name: string, constructor: Constructor | ConstructorTuple) => boolean;
    readonly get: (name: string) => any;
    readonly getSingleton: (name: string) => any;
    readonly remove: (name: string) => true | null;
};
export declare type Model = {
    readonly constructor: Constructor;
    readonly dependencies: readonly string[];
    instance?: any;
    name: string;
    readonly order: number;
};
export declare type Collection = Record<string, Model>;
export declare type ConstructorCollection = Record<string, Constructor | ConstructorTuple>;
