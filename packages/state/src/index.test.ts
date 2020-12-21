import { createStore } from '.';
import type { Store } from '.';

interface State {
  a: Boolean;
  b: {
    c: Boolean;
  };
  d: string;
}

let initialState: State;
let callback: jest.Mock;
let store: Store<State>;

describe('@crux/state', () => {
  beforeEach(() => {
    initialState = {
      a: true,
      b: {
        c: true,
      },
      d: 'test',
    };

    callback = jest.fn();

    store = createStore(initialState);
  });

  test('should add subscriber', () => {
    const getA = (state: State) => state.a;

    const { initialValue, unsubscribe } = store.subscribe(getA, callback);

    expect(store.subscribers.length).toEqual(1);
    expect(typeof unsubscribe).toEqual('function');
    expect(initialValue).toEqual(true);
  });

  test('should call callback when top level property is updated', () => {
    const getA = (state: State) => state.a;

    store.subscribe(getA, callback);

    store.update((state) => {
      state.a = false;

      return state;
    });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should call callback when reference changes', () => {
    const getB = (state: State) => state.b;

    store.subscribe(getB, callback);

    store.update((state) => {
      state.b = {
        c: true,
      };

      return state;
    });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should not call callback when reference does not change', () => {
    const getB = (state: State) => state.b;

    store.subscribe(getB, callback);

    store.update((state) => {
      state.b.c = false;

      return state;
    });

    expect(callback.mock.calls.length).toEqual(0);
  });

  test('should be able to transform output', () => {
    const getDTransformed = (state: State) => `${state.d} transformed`;

    store.subscribe(getDTransformed, callback);

    store.update((state) => {
      state.d = 'new value';

      return state;
    });

    expect(callback.mock.calls[0][0]).toEqual('new value transformed');
  });

  test('should destroy subscriber after calling returned destroy function', () => {
    const getB = (state: State) => state.b;

    const { unsubscribe } = store.subscribe(getB, callback);

    unsubscribe();

    store.update((state) => {
      state.b.c = false;

      return state;
    });

    expect(callback.mock.calls.length).toEqual(0);
    expect(store.subscribers.length).toEqual(0);
  });
});
