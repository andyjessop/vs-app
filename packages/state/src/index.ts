import { createSyncQueue } from '@crux/utils';

export interface Store<T> {
  pause(): void;
  resume(): void;
  state: T;
  subscribe(
    selector: any,
    callback: Function,
  ): { initialValue: any; unsubscribe: Function };
  subscribers: any[];
  update(callback: (state: T) => T): void;
}

/**
 * Create a store.
 */
export function createStore<T extends object>(initialState: T): Store<T> {
  const state = { ...initialState };
  const queue = createSyncQueue();
  let paused = false;
  const subscribers: any = [];

  return {
    pause,
    resume,
    state,
    subscribe,
    subscribers,
    update,
  };

  /**
   * Observe a slice of the state.
   */
  function subscribe(
    selector: any,
    callback: Function,
  ): { initialValue: any; unsubscribe: Function } {
    const initialValue = selector(state);

    const newSubscriber = {
      callback,
      currentValue: initialValue,
      selector,
    };

    subscribers.push(newSubscriber);

    return {
      initialValue,
      unsubscribe,
    };

    /**
     * Unsubscribe callback.
     */
    function unsubscribe() {
      const index = subscribers.indexOf(newSubscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    }
  }

  /**
   * Notify subscribers of changes.
   */
  function notify() {
    subscribers.forEach((subscriber: any) => {
      const newValue = subscriber.selector(state);

      if (newValue !== subscriber.currentValue) {
        queue.add(subscriber.callback, newValue);

        subscriber.currentValue = newValue;
      }
    });

    if (!paused) {
      queue.flush();
    }
  }

  /**
   * Pause reactivity.
   */
  function pause() {
    paused = true;
  }

  /**
   * Resume reactivity.
   */
  function resume() {
    paused = false;

    queue.flush();
  }

  function update(callback: (state: T) => T): void {
    Object.assign(state, callback(state));

    notify();
  }
}
