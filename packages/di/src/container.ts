import { allDependenciesExist } from './all-dependencies-exist';
import { byDependency } from './by-dependency';
import { getDependents } from './get-dependents';
import {
  API,
  Collection,
  Constructor,
  ConstructorCollection,
  ConstructorTuple,
  ConstructorCollectionTuple,
  Model,
} from './types';

export function createContainer<T>(
  initialServices?: ConstructorCollection<T>,
): API<T> {
  const services: Collection<T> = {};

  if (initialServices) {
    (<ConstructorCollectionTuple<T>[]>Object.entries(initialServices))
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
    name: keyof T,
    constructor:
      | Constructor<T[keyof T]>
      | ConstructorTuple<T[keyof T], keyof T>,
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

  function get<U extends keyof T>(name: U): T[U] {
    if (!services[name]) {
      throw new Error(`Service ${name} does not exist.`);
    }

    if (!services[name]?.instance) {
      instantiate(name);
    }

    return <T[U]>services[name]?.instance;
  }

  function getSingleton<U extends keyof T>(name: U): T[U] {
    if (!services[name]) {
      throw new Error(`Service ${name} does not exist.`);
    }

    return instantiate(name, true);
  }

  function instantiate<U extends keyof T>(name: U, singleton = false): T[U] {
    if (!services[name]) {
      throw new Error('Service does not exist');
    }

    if ((<Model<T>>services[name]).instance && !singleton) {
      // @ts-ignore
      return services[name].instance;
    }

    const dependencies = services[name]?.dependencies
      ? services[name]?.dependencies.map((dependency) =>
          instantiate(dependency),
        )
      : [];

    const instance = (<Model<T>>services[name]).constructor(
      ...(dependencies || []),
    );

    if (!singleton) {
      (<Model<T>>services[name]).instance = instance;
    }

    return <T[U]>instance;
  }

  function remove(name: keyof T): true | null {
    if (!services[name]) {
      return null;
    }

    if (getDependents(name, services).length) {
      return null;
    }

    services[name]?.instance?.destroy?.();

    delete services[name];

    return true;
  }
}
