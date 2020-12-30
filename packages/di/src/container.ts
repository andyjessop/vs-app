import { allDependenciesExist } from './all-dependencies-exist';
import { byDependency } from './by-dependency';
import { getDependents } from './get-dependents';
import {
  API,
  Collection,
  Constructor,
  ConstructorCollection,
  ConstructorTuple,
  Model,
} from './types';

export function createContainer(initialServices?: ConstructorCollection): API {
  const services: Collection = {};

  if (initialServices) {
    Object.entries(initialServices)
      // ensure dependent constructors are added after independent constructors
      .sort(byDependency)
      .forEach(([key, service]) => {
        add(key, service);
      });
  }

  return {
    add,
    get,
    getSingleton,
    remove,
    services,
  };

  function add(
    name: string,
    constructor: Constructor | ConstructorTuple,
  ): boolean {
    if (services[name]) {
      return false;
    }

    const order = Object.keys(services).length;

    if (typeof constructor === 'function') {
      services[name] = {
        constructor,
        dependencies: [],
        name,
        order,
      };
    } else {
      const [constructorFn, ...dependencies] = constructor;

      if (!allDependenciesExist(services, dependencies)) {
        return false;
      }

      services[name] = {
        constructor: constructorFn,
        dependencies,
        name,
        order,
      };
    }

    return true;
  }

  function get<T>(name: string): T | undefined {
    if (!services[name]) {
      return;
    }

    if (!services[name].instance) {
      instantiate(name);
    }

    return (services[name].instance as unknown) as T;
  }

  function getSingleton<T>(name: string): T | undefined {
    if (!services[name]) {
      return;
    }

    return (instantiate(name, true) as unknown) as T;
  }

  function instantiate(name: string, singleton = false): Model {
    if (services[name] && services[name].instance && !singleton) {
      return services[name].instance;
    }

    const dependencies = services[name].dependencies
      ? services[name].dependencies.map((dependency) => instantiate(dependency))
      : [];

    const instance = services[name].constructor(...dependencies);

    if (!singleton) {
      services[name].instance = instance;
    }

    return instance;
  }

  function remove(name: string): true | null {
    if (!services[name]) {
      return null;
    }

    if (getDependents(name, services).length) {
      return null;
    }

    services[name].instance?.destroy?.();

    delete services[name];

    return true;
  }
}
