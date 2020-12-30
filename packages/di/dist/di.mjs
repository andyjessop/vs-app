var types = /*#__PURE__*/ Object.freeze({
  __proto__: null,
});

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
  return Object.values(services)
    .filter((service) => service.dependencies.includes(name))
    .map((service) => service.name);
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
    getSingleton,
    remove,
    services,
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
  function getSingleton(name) {
    if (!services[name]) {
      return;
    }
    return instantiate(name, true);
  }
  function instantiate(name, singleton = false) {
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
  function remove(name) {
    var _a, _b;
    if (!services[name]) {
      return null;
    }
    if (getDependents(name, services).length) {
      return null;
    }
    (_b =
      (_a = services[name].instance) === null || _a === void 0
        ? void 0
        : _a.destroy) === null || _b === void 0
      ? void 0
      : _b.call(_a);
    delete services[name];
    return true;
  }
}

export { types as Container, createContainer };
//# sourceMappingURL=di.mjs.map
