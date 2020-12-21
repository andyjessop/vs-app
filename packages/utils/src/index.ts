/**
 * Event Emitter.
 */
import {
  API as EventEmitterAPI,
  Event as EventEmitterEvent,
  Handler as EventEmitterHandler,
  Listener as EventEmitterListener,
} from './event-emitter/event-emitter';

/**
 * Async Queue.
 */
import { API as AsyncQueueAPI, Entry as AsyncQueueEntry } from './async-queue/async-queue';

/**
 * Sync Queue.
 */
import { API as SyncQueueAPI, Entry as SyncQueueEntry } from './sync-queue/sync-queue';

export namespace EventEmitter {
  export type API = EventEmitterAPI;
  export type Event = EventEmitterEvent;
  export type Handler = EventEmitterHandler;
  export type Listener = EventEmitterListener;
}

export { createEventEmitter } from './event-emitter/event-emitter';

export namespace AsyncQueue {
  export type API = AsyncQueueAPI;
  export type Entry = AsyncQueueEntry;
}

export { createAsyncQueue } from './async-queue/async-queue';

export namespace SyncQueue {
  export type API = SyncQueueAPI;
  export type Entry = SyncQueueEntry;
}

export { createSyncQueue } from './sync-queue/sync-queue';
