export interface API {
    add: (fn: Function, ...params: any[]) => void;
    flush: () => void;
}
export interface Entry {
    fn: Function;
    params: any[];
}
export declare function createSyncQueue(): API;
