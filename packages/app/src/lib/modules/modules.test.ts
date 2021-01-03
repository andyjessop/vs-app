import * as Modules from './types';
import { createModules } from './modules';
import { Container, createContainer } from '@crux/di';
import { Services as AppServices } from '../types';

interface Services {
  a: any;
}

let container: Container.API<Services>;
let app: Container.API<AppServices>;
let initialModules: Modules.ConstructorCollection<Services>;
let modules: Modules.API<Services>;

let actionAa: jest.Mock;
let actionBb: jest.Mock;
let destroyD: jest.Mock;

describe('modules', () => {
  beforeEach(async function setup() {
    container = createContainer(<Services>{
      a: () => jest.fn(),
    });

    app = <Container.API<AppServices>>(<unknown>jest.fn());

    actionAa = jest.fn();
    actionBb = jest.fn();
    destroyD = jest.fn();

    initialModules = {
      a: (container) => {
        return {
          actions: {
            a: actionAa,
          },
          destroy: jest.fn(),
        };
      },
      b: () => {
        return {
          actions: {
            b: actionBb,
          },
          destroy: jest.fn(),
        };
      },
      c: (container) => import('./test/dynamic-import-c').then((mod) => mod.createC()),
      d: {
        module: () => {
          return {
            actions: {
              d: () => 'd',
            },
            destroy: destroyD,
          };
        },
        routes: ['d'],
      },
    };

    modules = await createModules(initialModules, app, container);
  });

  test('should register initial modules', () => {
    expect(modules.get('a')?.actions?.a).toEqual(actionAa);
    expect(modules.get('b')?.actions?.b).toEqual(actionBb);
    expect(modules.get('d')).toBeUndefined();

    modules.getDynamic('c')?.then((mod) => {
      expect(mod.actions?.c()).toEqual('c');
    });
  });

  test('should activate module when navigating to route', async function doTest() {
    await modules.onRouteEnter({ name: 'd', params: null });

    expect(modules.get('d')?.actions?.d()).toEqual('d');
  });

  test('should destroy module when navigating from route', async function doTest() {
    await modules.onRouteEnter({ name: 'd', params: null });

    await modules.onRouteEnter({ name: 'x', params: null });

    expect(destroyD.mock.calls.length).toEqual(1);
  });

  test('should add modules', () => {
    modules.add('z', () => {
      return {
        actions: {
          z: () => 'z',
        },
      };
    });

    expect(modules.get('z')?.actions?.z()).toEqual('z');

    modules.add('e', () => import('./test/dynamic-import-e').then((mod) => mod.createE()));

    modules.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
    });
  });

  test('should activate dynamic module when navigating to route', async function doTest() {
    modules.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE()),
      routes: ['e'],
    });

    expect(modules.getDynamic('e')).toBeUndefined();

    await modules.onRouteEnter({ name: 'e', params: null });

    modules.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
    });
  });

  test('should destroy dynamic module when navigating from route', async function doTest() {
    const callback = jest.fn();

    modules.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE(callback)),
      routes: ['e'],
    });

    await modules.onRouteEnter({ name: 'e', params: null });

    await modules.onRouteEnter({ name: 'x', params: null });

    expect(callback.mock.calls.length).toEqual(1);
  });

  test('should not destroy module when navigating to second route', async function doTest() {
    const callback = jest.fn();

    modules.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE(callback)),
      routes: ['e', 'f'],
    });

    await modules.onRouteEnter({ name: 'e', params: null });

    await modules.onRouteEnter({ name: 'f', params: null });

    expect(callback.mock.calls.length).toEqual(0);
  });

  test('should activate module when navigating to route with params', async function doTest() {
    const callback = jest.fn();

    modules.add('e', {
      module: () => import('./test/dynamic-import-e').then((mod) => mod.createE(callback)),
      routes: ['f', { name: 'e', params: { x: true } }],
    });

    // Valid route
    await modules.onRouteEnter({ name: 'e', params: { x: true } });

    await modules.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
      expect(callback.mock.calls.length).toEqual(0);
    });

    // Valid route
    await modules.onRouteEnter({ name: 'f', params: null });

    await modules.getDynamic('e')?.then((mod) => {
      expect(mod.actions?.e()).toEqual('e');
      expect(callback.mock.calls.length).toEqual(0);
    });

    // Invalid route (no params)
    await modules.onRouteEnter({ name: 'e', params: null });

    expect(modules.getDynamic('e')).toBeUndefined();
    expect(callback.mock.calls.length).toEqual(1);
  });
});
