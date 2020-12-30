export declare type Constructor = (...args: any[]) => any;
export declare type ConstructorTuple = [Constructor, ...string[]];
export declare type ConstructorCollection = Record<string, Constructor | ConstructorTuple>;
export declare type ConstructorCollectionTuple = [
    string,
    Constructor | ConstructorTuple
];
export declare type Model = {
    readonly constructor: Constructor;
    readonly dependencies: readonly string[];
    instance?: any;
    name: string;
    readonly order: number;
};
export declare type Collection = Record<string, Model>;
export declare type API = {
    readonly add: (name: string, constructor: Constructor | ConstructorTuple) => boolean;
    get<T = any>(name: string): T | undefined;
    getSingleton<T = any>(name: string): T | undefined;
    readonly remove: (name: string) => true | null;
    readonly services: Collection;
};
