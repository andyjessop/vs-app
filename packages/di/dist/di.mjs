function allDependenciesExist(services, dependencies) {
  const servicesKeys = Object.keys(services);
  return dependencies.every((dependency) => servicesKeys.includes(dependency));
}

function byDependency(a, b) {
  const [aKey, aService] = a;
  const [bKey, bService] = b;
  if (typeof aService === 'function') {
    return -1;
  }
  if (typeof bService === 'function') {
    return 1;
  }
  if (aService.includes(bKey)) {
    return 1;
  }
  if (bService.includes(aKey)) {
    return -1;
  }
  return 0;
}

function getDependents(name, services) {
  return Object.entries(services)
    .filter(([key, service]) => service.dependencies.includes(name))
    .map(([key, service]) => service.name);
}

function createContainer(initialServices) {
  const services = {};
  if (initialServices) {
    Object.entries(initialServices)
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
  function add(name, constructor) {
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
  function get(name) {
    if (!services[name]) {
      return;
    }
    if (!services[name].instance) {
      instantiate(name);
    }
    return services[name].instance;
  }
  function instantiate(name) {
    const dependencies = services[name].dependencies
      ? services[name].dependencies.map(
          (dependency) => instantiate(dependency).instance,
        )
      : [];
    services[name].instance = services[name].constructor(...dependencies);
    return services[name];
  }
  function remove(name) {
    if (getDependents(name, services).length) {
      return null;
    }
    delete services[name];
    return true;
  }
}

export { createContainer };
//# sourceMappingURL=di.mjs.map
