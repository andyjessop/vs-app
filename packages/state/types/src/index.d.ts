/**
 * Create a store.
 */
export declare function createStore<T extends object>(initialState: T): {
    pause: () => void;
    resume: () => void;
    state: T;
    subscribe: (selector: any, callback: Function) => () => void;
    update: (callback: (state: T) => T) => void;
};
