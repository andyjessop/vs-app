/**
 * Event Emitter.
 */
import { API as EventEmitterAPI, Event as EventEmitterEvent, Handler as EventEmitterHandler, Listener as EventEmitterListener } from './event-emitter/event-emitter';
/**
 * Async Queue.
 */
import { API as AsyncQueueAPI, Entry as AsyncQueueEntry } from './async-queue/async-queue';
/**
 * Sync Queue.
 */
import { API as SyncQueueAPI, Entry as SyncQueueEntry } from './sync-queue/sync-queue';
export declare namespace EventEmitter {
    type API = EventEmitterAPI;
    type Event = EventEmitterEvent;
    type Handler = EventEmitterHandler;
    type Listener = EventEmitterListener;
}
export { createEventEmitter } from './event-emitter/event-emitter';
export declare namespace AsyncQueue {
    type API = AsyncQueueAPI;
    type Entry = AsyncQueueEntry;
}
export { createAsyncQueue } from './async-queue/async-queue';
export declare namespace SyncQueue {
    type API = SyncQueueAPI;
    type Entry = SyncQueueEntry;
}
export { createSyncQueue } from './sync-queue/sync-queue';
