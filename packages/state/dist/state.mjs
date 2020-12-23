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

function createStore(initialState) {
  const state = { ...initialState };
  const queue = createSyncQueue();
  let paused = false;
  const subscribers = [];
  return {
    pause,
    resume,
    state,
    subscribe,
    subscribers,
    update,
  };
  function subscribe(selector, callback) {
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
    function unsubscribe() {
      const index = subscribers.indexOf(newSubscriber);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    }
  }
  function notify() {
    subscribers.forEach((subscriber) => {
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
  function pause() {
    paused = true;
  }
  function resume() {
    paused = false;
    queue.flush();
  }
  function update(callback) {
    Object.assign(state, callback(state));
    notify();
  }
}

export { createStore };
//# sourceMappingURL=state.mjs.map
