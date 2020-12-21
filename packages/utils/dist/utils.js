(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global.utils = {})));
})(this, function (exports) {
  'use strict';

  function createEventEmitter() {
    const listeners = [];
    return {
      addListener,
      emit,
      removeListener,
    };
    function addListener(type, handler) {
      const listener = { handler, type };
      listeners.push(listener);
    }
    function emit(type, data) {
      let listener;
      for (listener of listeners) {
        if (listener.type !== type) {
          continue;
        }
        listener.handler(data);
      }
    }
    function removeListener(type, handler) {
      const ndx = listeners.findIndex((l) => type === l.type && handler === l.handler);
      if (ndx !== -1) {
        listeners.splice(ndx, 1);
      }
    }
  }

  function createAsyncQueue() {
    const entries = [];
    let flushing = false;
    return {
      add,
      clear,
      flush,
    };
    function add(fn, ...params) {
      let rej = () => {};
      let res = () => {};
      const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
      });
      entries.push({
        fn,
        params,
        reject: rej,
        resolve: res,
      });
      return promise;
    }
    function clear() {
      flushing = false;
      entries.length = 0;
    }
    async function flush() {
      if (flushing) {
        return;
      }
      const entry = entries[0];
      if (!entry) {
        flushing = false;
        return;
      }
      flushing = true;
      try {
        const result = await entry.fn(...entry.params);
        entry.resolve(result);
        entries.shift();
        if (entries.length === 0) {
          flushing = false;
        }
        return flush();
      } catch (e) {
        entry.reject(e);
      }
    }
  }

  function createSyncQueue() {
    const entries = [];
    let flushing = false;
    return {
      add,
      flush,
    };
    function add(fn, ...params) {
      entries.push({
        fn,
        params,
      });
    }
    function flush() {
      if (flushing) {
        return;
      }
      const entry = entries.shift();
      if (!entry) {
        flushing = false;
        return;
      }
      flushing = true;
      entry.fn(...entry.params);
      if (entries.length) {
        return flush();
      }
    }
  }

  exports.createAsyncQueue = createAsyncQueue;
  exports.createEventEmitter = createEventEmitter;
  exports.createSyncQueue = createSyncQueue;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=utils.js.map
