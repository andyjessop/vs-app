export interface API {
    add: (fn: Function, ...params: any[]) => Promise<any>;
    clear: () => void;
    flush: () => Promise<any>;
}
export interface Entry {
    fn: Function;
    params: any[];
    reject: Function;
    resolve: Function;
}
export declare function createAsyncQueue(): API;
