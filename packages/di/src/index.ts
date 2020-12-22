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
    remove,
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

  function get(name: string): any | undefined {
    if (!services[name]) {
      return;
    }

    if (!services[name].instance) {
      instantiate(name);
    }

    return services[name].instance;
  }

  function instantiate(name: string): Model {
    const dependencies = services[name].dependencies
      ? services[name].dependencies.map(
          (dependency) => instantiate(dependency).instance,
        )
      : [];

    services[name].instance = services[name].constructor(...dependencies);

    return services[name];
  }

  function remove(name: string): true | null {
    if (getDependents(name, services).length) {
      return null;
    }

    delete services[name];

    return true;
  }
}
