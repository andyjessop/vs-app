import { API } from './types';
import { createContainer } from '.';

let initialServices: Record<string, any>;
let container: API;

describe('@crux/di', () => {
  beforeEach(() => {
    initialServices = {
      a: createA,
      b: createB,
      c: [createC, 'a'],
    };

    container = createContainer(initialServices);
  });

  test('should register services', () => {
    expect(container.get('a').get()).toEqual('a');
    expect(container.get('b').get()).toEqual('b');
    expect(container.get('c').get()).toEqual('ca');
  });

  test('should add a service', () => {
    container.add('d', createD);

    expect(container.get('d').get()).toEqual('d');
  });

  test('should add a service with a dependency', () => {
    container.add('e', [createE, 'b']);

    expect(container.get('e').get()).toEqual('eb');
  });

  test('should return false if dependency does not exist', () => {
    expect(container.add('d', [createD, 'x'])).toEqual(false);
    expect(container.get('d')).toBeUndefined();
  });

  test('should remove a service', () => {
    container.remove('b');

    expect(container.get('b')).toBeUndefined();
  });

  test('should not remove a service if another is dependent on it', () => {
    expect(container.remove('a')).toEqual(null);

    expect(container.get('a').get()).toEqual('a');
  });
});

function createA() {
  return {
    get: () => 'a',
    set: (str: 'a') => 'a',
  };
}

function createB() {
  return {
    get: () => 'b',
    set: (str: 'b') => 'b',
  };
}

function createC(a: any) {
  return {
    get: () => `c${a.get()}`,
    set: (str: 'c') => `c${a.set(str)}`,
  };
}

function createD() {
  return {
    get: () => 'd',
    set: (str: 'd') => 'd',
  };
}

function createE(b: any) {
  return {
    get: () => `e${b.get()}`,
    set: (str: 'e') => `e${b.set(str)}`,
  };
}
