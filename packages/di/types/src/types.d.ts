export declare type Constructor<T> = (...args: any[]) => T;
export declare type ConstructorTuple<T, U> = [Constructor<T>, ...U[]];
export declare type ConstructorCollection<T> = Record<keyof T, Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], keyof T>>;
export declare type ConstructorCollectionTuple<T> = [
    keyof T,
    Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], keyof T>
];
export declare type Model<T> = {
    readonly constructor: Constructor<T[keyof T]>;
    dependencies: (keyof T)[];
    instance?: T[keyof T] & {
        destroy?: Function;
    };
    name: keyof T;
    readonly order: number;
};
export declare type Collection<T> = Partial<Record<keyof T, Model<T>>>;
export declare type API<T> = {
    readonly add: (name: keyof T, constructor: Constructor<T[keyof T]> | ConstructorTuple<T[keyof T], keyof T>) => boolean;
    get<U extends keyof T>(name: U): T[U];
    getSingleton<U extends keyof T>(name: U): T[U];
    readonly remove: (name: keyof T) => true | null;
    readonly services: Collection<T>;
};
