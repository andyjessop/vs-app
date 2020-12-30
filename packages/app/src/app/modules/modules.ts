import { Container } from '@crux/di';
import { Router } from '@crux/router';
import { createAsyncQueue } from '@crux/utils';
import * as Modules from './types';

export async function createModules(
  collection: Modules.ConstructorCollection,
  container: Container.API,
): Promise<Modules.API> {
  const routeMap: Map<string, string[]> = new Map();
  const constructorsMap: Map<string, Modules.Constructor> = new Map();
  const activeModulesMap: Map<string, Modules.Module | Promise<Modules.Module>> = new Map();
  const queue = createAsyncQueue();

  routeMap.set(toRouteString('all'), []);
  Object.entries(collection).forEach(([name, constructor]) => add(name, constructor));
  await onRouteEnter({ name: 'all', params: null });

  return {
    add,
    get,
    getDynamic,
    onRouteEnter,
    remove,
  };

  function add(
    name: string,
    constructor: Modules.Constructor | Modules.ConstructorObject,
  ): boolean | null {
    // If the constructor is an object then it is associated with one or more routes.
    if (typeof constructor === 'object') {
      const { module, routes } = constructor;

      if (!module || !routes?.length) {
        return null;
      }

      routes
        // Map to stringified route name and params
        .map(toRouteString)
        // Add to routeMap as individual entries
        .forEach((routeString) => {
          if (!routeMap.get(routeString)) {
            routeMap.set(routeString, []);
          }

          // Add it to the route map for this route.
          routeMap.set(routeString, (<string[]>routeMap.get(routeString)).concat(name));
        });

      constructorsMap.set(name, module);

      return true;
    }

    // Add it to the route map for ALL routes if no routes have been specified.
    routeMap.set(toRouteString('all'), (<string[]>routeMap.get(toRouteString('all'))).concat(name));

    constructorsMap.set(name, constructor);
    activeModulesMap.set(name, constructor(container));

    return true;
  }

  function get(name: string): Modules.Module | undefined {
    const module = activeModulesMap.get(name);

    // @ts-ignore "then" always exists on a Promised module, but this assertion
    // is required in order to check for "then".
    if ((<Promise<Modules.Module>>module)?.then) {
      return undefined;
    }

    return <Modules.Module>module;
  }

  function getDynamic(name: string): Promise<Modules.Module> | undefined {
    const module = activeModulesMap.get(name);

    if (!(<Promise<Modules.Module>>module)?.then) {
      return undefined;
    }

    return <Promise<Modules.Module>>module;
  }

  async function onRouteEnter(route: Router.RouteData): Promise<boolean> {
    await queue.flush();

    const allRouteModules = routeMap.get(toRouteString('all')) || [];
    const currentRouteModules = routeMap.get(toRouteString(route)) || [];

    const moduleNames = new Set((<string[]>[]).concat(allRouteModules).concat(currentRouteModules));

    // Remove any active modules that are not relevant to this route
    activeModulesMap.forEach((module, name) => {
      if (!moduleNames.has(name)) {
        remove(name);
      }
    });

    moduleNames.forEach((name) => {
      // Activate module if not already.
      if (!activeModulesMap.has(name)) {
        const constructor = constructorsMap.get(name);

        if (!constructor) {
          return false;
        }

        activeModulesMap.set(name, constructor(container));
      }

      return true;
    });

    return true;
  }

  function remove(name: string): void {
    queue.add(removeFn, name);
    queue.flush();
  }

  async function removeFn(name: string): Promise<boolean | null> {
    if (activeModulesMap.has(name)) {
      (await activeModulesMap.get(name))?.destroy?.();
      activeModulesMap.delete(name);
    }

    return constructorsMap.delete(name);
  }
}

function toRouteString(route: string | Router.RouteData) {
  const routeObj = typeof route === 'object' ? route : { name: route, params: null };

  return JSON.stringify(routeObj, replacer);
}

function replacer(k: string, value: any) {
  return value instanceof Object && !(value instanceof Array)
    ? Object.keys(value)
        .sort()
        .reduce((sorted: any, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {})
    : value;
}
