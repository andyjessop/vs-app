function createAsyncQueue() {
  const entries = [];
  let flushing = false;
  return {
    add,
    clear,
    flush,
  };
  function add(fn, ...params) {
    let rej = () => {};
    let res = () => {};
    const promise = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    entries.push({
      fn,
      params,
      reject: rej,
      resolve: res,
    });
    return promise;
  }
  function clear() {
    flushing = false;
    entries.length = 0;
  }
  async function flush() {
    if (flushing) {
      return;
    }
    const entry = entries[0];
    if (!entry) {
      flushing = false;
      return;
    }
    flushing = true;
    try {
      const result = await entry.fn(...entry.params);
      entry.resolve(result);
      entries.shift();
      if (entries.length === 0) {
        flushing = false;
      }
      return flush();
    } catch (e) {
      entry.reject(e);
    }
  }
}

var Router;
(function (Router) {
  let Events;
  (function (Events) {
    Events['Transition'] = 'transition';
  })((Events = Router.Events || (Router.Events = {})));
})(Router || (Router = {}));

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
    if (getDependents(name, services).length) {
      return null;
    }
    delete services[name];
    return true;
  }
}

async function createModules(collection, container) {
  const routeMap = new Map();
  const constructorsMap = new Map();
  const activeModulesMap = new Map();
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
  function add(name, constructor) {
    if (typeof constructor === 'object') {
      const { module, routes } = constructor;
      if (!module || !(routes === null || routes === void 0 ? void 0 : routes.length)) {
        return null;
      }
      routes.map(toRouteString).forEach((routeString) => {
        if (!routeMap.get(routeString)) {
          routeMap.set(routeString, []);
        }
        routeMap.set(routeString, routeMap.get(routeString).concat(name));
      });
      constructorsMap.set(name, module);
      return true;
    }
    routeMap.set(toRouteString('all'), routeMap.get(toRouteString('all')).concat(name));
    constructorsMap.set(name, constructor);
    activeModulesMap.set(name, constructor(container));
    return true;
  }
  function get(name) {
    var _a;
    const module = activeModulesMap.get(name);
    if ((_a = module) === null || _a === void 0 ? void 0 : _a.then) {
      return undefined;
    }
    return module;
  }
  function getDynamic(name) {
    var _a;
    const module = activeModulesMap.get(name);
    if (!((_a = module) === null || _a === void 0 ? void 0 : _a.then)) {
      return undefined;
    }
    return module;
  }
  async function onRouteEnter(route) {
    await queue.flush();
    const allRouteModules = routeMap.get(toRouteString('all')) || [];
    const currentRouteModules = routeMap.get(toRouteString(route)) || [];
    const moduleNames = new Set([].concat(allRouteModules).concat(currentRouteModules));
    activeModulesMap.forEach((module, name) => {
      if (!moduleNames.has(name)) {
        remove(name);
      }
    });
    moduleNames.forEach((name) => {
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
  function remove(name) {
    queue.add(removeFn, name);
    queue.flush();
  }
  async function removeFn(name) {
    var _a, _b;
    if (activeModulesMap.has(name)) {
      (_b =
        (_a = await activeModulesMap.get(name)) === null || _a === void 0 ? void 0 : _a.destroy) ===
        null || _b === void 0
        ? void 0
        : _b.call(_a);
      activeModulesMap.delete(name);
    }
    return constructorsMap.delete(name);
  }
}
function toRouteString(route) {
  const routeObj = typeof route === 'object' ? route : { name: route, params: null };
  return JSON.stringify(routeObj, replacer);
}
function replacer(k, value) {
  return value instanceof Object && !(value instanceof Array)
    ? Object.keys(value)
        .sort()
        .reduce((sorted, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {})
    : value;
}

function createHooks() {}

async function createApp({
  baseRoute,
  createMounter,
  createRouter,
  layout,
  modules: modulesCollection,
  routes,
  services: servicesCollection,
  views: viewsCollection,
}) {
  const router = createRouter(baseRoute, routes);
  const container = createContainer({
    hooks: createHooks,
    router: () => router,
    ...servicesCollection,
  });
  const mounter = createMounter(container, viewsCollection, '[data-view-id]');
  const queue = createAsyncQueue();
  const modules = await createModules(modulesCollection, container);
  router.addListener(Router.Events.Transition, () => {
    queue.add(modules.onRouteEnter, router.getCurrentRoute());
    dispatch();
  });
  return {
    dispatch,
    router,
  };
  function dispatch(moduleName, action, data) {
    queue.add(queuedDispatch, moduleName, action, data);
    queue.flush();
  }
  async function queuedDispatch(moduleName, action, data) {
    if (moduleName && action) {
      let module = modules.get(moduleName);
      if (!module) {
        module = await modules.getDynamic(moduleName);
      }
      if (module) {
        module.actions[action](data);
      }
    }
    await layout.update(container);
    await mounter.run();
  }
}

var types = /*#__PURE__*/ Object.freeze({
  __proto__: null,
});

export { types as App, createApp };
//# sourceMappingURL=app.mjs.map
