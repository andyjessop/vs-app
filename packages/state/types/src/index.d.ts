export interface Store<T> {
    pause(): void;
    resume(): void;
    state: T;
    subscribe(selector: any, callback: Function): {
        initialValue: any;
        unsubscribe: Function;
    };
    subscribers: any[];
    update(callback: (state: T) => T): void;
}
/**
 * Create a store.
 */
export declare function createStore<T extends object>(initialState: T): Store<T>;
