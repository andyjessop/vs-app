export interface API {
  add: (fn: Function, ...params: any[]) => void;
  flush: () => void;
}

export interface Entry {
  fn: Function;
  params: any[];
}

export function createSyncQueue(): API {
  const entries: Entry[] = [];
  let flushing = false;

  return {
    add,
    flush,
  };

  function add(fn: Function, ...params: any[]): void {
    entries.push({
      fn,
      params,
    });
  }

  function flush(): void {
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
