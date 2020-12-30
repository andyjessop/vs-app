export interface Event {
    data: any;
    type: string;
}
export declare type Handler = (event: Event) => any;
export interface API {
    addListener: (type: string, handler: Handler) => void;
    emit: (type: string, data?: any) => Promise<void[]>;
    removeListener: (type: string, handler: Handler) => void;
}
export interface Listener {
    type: string;
    handler: Handler;
}
/**
 * Create an event emitter.
 */
export declare function createEventEmitter(): API;
