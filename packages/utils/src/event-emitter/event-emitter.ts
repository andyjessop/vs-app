export interface Event {
  data: any;
  type: string;
}

export type Handler = (event: Event) => any;

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
export function createEventEmitter(): API {
  const listeners: Listener[] = [];

  return {
    addListener,
    emit,
    removeListener,
  };

  /**
   * Subscribe to an event.
   */
  function addListener(type: string, handler: Handler): void {
    const listener = { handler, type };

    listeners.push(listener);
  }

  /**
   * Emit an event.
   */
  function emit(type: string, data: any): Promise<void[]> {
    let listener: Listener;
    const promises: Promise<void>[] = [];

    for (listener of listeners) {
      if (listener.type !== type) {
        continue;
      }

      const result = listener.handler(data);

      if (result?.then) {
        promises.push(result);
      }
    }

    return Promise.all(promises);
  }

  /**
   * Remove a listener.
   */
  function removeListener(type: string, handler: Handler): void {
    const ndx = listeners.findIndex((l: Listener) => type === l.type && handler === l.handler);

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }
}
