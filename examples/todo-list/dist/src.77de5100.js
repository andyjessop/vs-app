// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@crux/app/dist/app.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.createAppBuilder = createAppBuilder;
exports.createStoreModule = createStoreModule;
exports.Views = exports.Mounter = exports.Modules = exports.Layout = exports.App = void 0;

function createEventEmitter() {
  const listeners = [];
  return {
    addListener,
    emit,
    removeListener
  };

  function addListener(type, handler) {
    const listener = {
      handler,
      type
    };
    listeners.push(listener);
  }

  function emit(type, data) {
    let listener;
    const promises = [];

    for (listener of listeners) {
      if (listener.type !== type) {
        continue;
      }

      const result = listener.handler(data);

      if (result === null || result === void 0 ? void 0 : result.then) {
        promises.push(result);
      }
    }

    return Promise.all(promises);
  }

  function removeListener(type, handler) {
    const ndx = listeners.findIndex(l => type === l.type && handler === l.handler);

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }
}

function createAsyncQueue() {
  const entries = [];
  let flushing = false;
  return {
    add,
    clear,
    flush
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
      resolve: res
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
      return;
    }

    flushing = true;

    try {
      const result = await entry.fn(...entry.params);
      entry.resolve(result);
      entries.shift();
      flushing = false;
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
  })(Events = Router.Events || (Router.Events = {}));
})(Router || (Router = {}));

function createEventEmitter$1() {
  const listeners = [];
  return {
    addListener,
    emit,
    removeListener
  };

  function addListener(type, handler) {
    const listener = {
      handler,
      type
    };
    listeners.push(listener);
  }

  function emit(type, data) {
    let listener;
    const promises = [];

    for (listener of listeners) {
      if (listener.type !== type) {
        continue;
      }

      const result = listener.handler(data);

      if (result === null || result === void 0 ? void 0 : result.then) {
        promises.push(result);
      }
    }

    return Promise.all(promises);
  }

  function removeListener(type, handler) {
    const ndx = listeners.findIndex(l => type === l.type && handler === l.handler);

    if (ndx !== -1) {
      listeners.splice(ndx, 1);
    }
  }
}

const namedParamRegex = /:\w[\w\d_]*(<[^>]+>)?/g;

function escapeRegexes(pattern) {
  const match = pattern.match(namedParamRegex) || [];

  for (let i = 0; i < match.length; i++) {
    const m = match[i];
    const regex = m.slice(m.indexOf('<') + 1, m.length - 1);
    pattern = pattern.replace(regex, encodeURIComponent(regex));
  }

  return pattern;
}

function getHash(path) {
  return decodeURIComponent(path.replace(/^#/, ''));
}

function parseSegment(seg) {
  if (seg[0] === ':') {
    let regex = null;
    const ndx = seg.indexOf('<');
    let name = seg.slice(1, seg.length);

    if (ndx >= 0) {
      if (seg[seg.length - 1] !== '>') {
        throw new Error('No closing >');
      }

      const regexStr = seg.slice(ndx + 1, seg.length - 1);
      regex = new RegExp(`^(${regexStr})$`);
      name = seg.slice(1, ndx);
    }

    return function curriedParseSegment(str, paths, array = false) {
      if (array) {
        paths[name] = [].concat(paths[name] || [], str);
      } else {
        paths[name] = str;
      }

      return !(regex && !regex.test(str));
    };
  } else {
    return function curriedParseSegment(str) {
      return str === seg;
    };
  }
}

function parsePaths(targets) {
  const parsers = targets.map(parseSegment);
  return function curriedParsePaths(path, params) {
    if (targets.length !== path.length) {
      return false;
    }

    for (let i = 0; i < targets.length; i++) {
      if (!parsers[i](path[i], params)) {
        return false;
      }
    }

    return true;
  };
}

function isList(p) {
  return p.endsWith('*');
}

function isOptional(p) {
  return p.endsWith('?');
}

function paramName(n) {
  if (isOptional(n) || isList(n)) {
    return n.slice(0, -1);
  }

  return n;
}

function parseQueries(target) {
  const keys = Array.from(target.keys());
  const parsers = keys.map(key => parseSegment(target.get(key)));
  return function curriedParseQueries(query, params) {
    const queryKeys = Array.from(query.keys());

    if (!keys.every(x => isOptional(x) || isList(x) || queryKeys.includes(x))) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      const key = paramName(keys[i]);

      if (isList(keys[i])) {
        Array.from(query.entries()).filter(x => x[0] === key).forEach(x => parsers[i](x[1], params, true));
      } else if (!parsers[i](query.get(key), params) && !isOptional(keys[i])) {
        return false;
      }
    }

    return true;
  };
}

function pathToURL(url) {
  return new URL(`ftp://x/${url}`);
}

function trimSlashes(p) {
  return p.replace(/(\/$)|(^\/)/g, '');
}

function splitPath(path) {
  return trimSlashes(path).split('/').map(decodeURIComponent);
}

function parse(pattern) {
  if (pattern[0] !== '/') {
    throw new Error('Must start with /');
  }

  const target = pathToURL(escapeRegexes(trimSlashes(pattern)));
  const targetSegments = splitPath(trimSlashes(target.pathname));
  const targetHash = getHash(target.hash);
  const pq = parseQueries(target.searchParams);
  const pp = parsePaths(targetSegments);
  const ph = parseSegment(targetHash);
  return function decodeURL(urlString) {
    const route = new URL(urlString);
    const params = {};

    if (pp(splitPath(trimSlashes(route.pathname)), params) && pq(route.searchParams, params) && ph(getHash(route.hash), params)) {
      return params;
    }

    return null;
  };
}

function reverseSegment(str, dict) {
  const match = str.match(namedParamRegex) || [];

  for (let i = 0; i < match.length; i++) {
    const m = match[i];
    const endIx = m.indexOf('<');
    let name = m.slice(1, endIx < 0 ? m.length : endIx);

    if (isOptional(name) || isList(name)) {
      name = name.slice(0, -1);
    }

    if (!(name in dict)) {
      throw new Error(`${name} ${undefined}`);
    }

    str = str.replace(m, dict[name]);
  }

  return str;
}

function reverse(pattern) {
  const escapedString = escapeRegexes(trimSlashes(pattern));
  const target = pathToURL(escapedString);
  const segments = splitPath(target.pathname);
  return function encodeURL(dict) {
    const result = pathToURL('');
    result.pathname = segments.map(x => reverseSegment(x, dict)).join('/');
    target.searchParams.forEach((regex, n) => {
      const name = paramName(n);

      if (isList(n)) {
        [].concat(dict[name]).filter(Boolean).forEach(x => {
          result.searchParams.append(name, reverseSegment(x, dict));
        });
      } else if (!isOptional(n) || dict[name]) {
        result.searchParams.set(name, reverseSegment(regex, dict));
      }
    });
    result.hash = reverseSegment(decodeURIComponent(target.hash), dict);
    return `${result}`.replace('ftp://x', '');
  };
}

function getRouteData(route) {
  if (!route) {
    return null;
  }

  return {
    name: route.route.name,
    params: route.params
  };
}

function buildEvent({
  last,
  next,
  type
}) {
  return {
    last: getRouteData(last),
    next: getRouteData(next),
    type
  };
}

function paramsToStrings(dict) {
  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      if (Array.isArray(dict[key])) {
        for (let i = 0; i < dict[key].length; i++) {
          dict[key][i] = dict[key][i].toString();
        }
      } else {
        dict[key] = dict[key] ? dict[key].toString() : null;
      }
    }
  }

  return dict;
}

function createRouter(base, initialRoutes, emitter = createEventEmitter$1()) {
  const trimmedBase = trimSlashes(base);
  const routes = {};
  [['root', '/'], ['notFound', '/404'], ...Object.entries(initialRoutes)].forEach(([name, path]) => register(name, path));
  let currentRoute = getMatchingRoute(window.location.href);
  navigate(currentRoute.route.name, currentRoute.params);
  window.addEventListener('popstate', refreshCurrentRoute);
  return {
    back,
    destroy,
    ...emitter,
    forward,
    getCurrentRoute,
    go,
    navigate,
    register,
    replace
  };

  function destroy() {
    window.removeEventListener('popstate', refreshCurrentRoute);
  }

  function createRoute(name, path) {
    return {
      decodeURL: parse(path),
      encodeURL: reverse(path),
      name
    };
  }

  function getCurrentRoute() {
    return getRouteData(currentRoute);
  }

  function getMatchingRoute(url) {
    let params = null;
    const route = Object.values(routes).find(route => {
      params = route.decodeURL(url);
      return params !== null;
    });

    if (!route) {
      return {
        params: null,
        route: routes.notFound
      };
    }

    return {
      params,
      route
    };
  }

  function refreshCurrentRoute() {
    const lastRoute = currentRoute;
    currentRoute = getMatchingRoute(window.location.href);
    emitter.emit(Router.Events.Transition, buildEvent({
      last: lastRoute,
      next: currentRoute,
      type: Router.Events.Transition
    }));
  }

  function go(num) {
    window.history.go(num);
  }

  function back() {
    window.history.go(-1);
  }

  function forward() {
    window.history.go(1);
  }

  function navigate(name, params = {}) {
    const route = routes[name];

    if (!route) {
      return transition(routes['404']);
    }

    transition(route, params);
  }

  function register(name, path) {
    if (typeof path === 'undefined' || typeof name === 'undefined') {
      return null;
    }

    routes[name] = createRoute(name, `${trimmedBase}${path}`);
    return true;
  }

  function replace(name, params = {}) {
    const route = routes[name];

    if (!route) {
      return transition(routes['404']);
    }

    transition(route, params, true);
  }

  function transition(route, params = {}, replace = false) {
    let url;

    try {
      url = route.encodeURL(paramsToStrings(params));
    } catch (e) {
      return transition(routes.notFound);
    }

    if (!url) {
      return transition(routes.notFound);
    }

    const fullURL = `${window.location.origin}${url}`;

    if (fullURL === window.location.href) {
      return;
    }

    const lastRoute = currentRoute;
    currentRoute = {
      params,
      route
    };

    if (replace) {
      window.history.replaceState({
        name: route.name,
        params
      }, '', fullURL);
    } else {
      window.history.pushState({
        name: route.name,
        params
      }, '', fullURL);
    }

    emitter.emit(Router.Events.Transition, buildEvent({
      last: lastRoute,
      next: currentRoute,
      type: Router.Events.Transition
    }));
  }
}

function allDependenciesExist(services, dependencies) {
  const servicesKeys = Object.keys(services);
  return dependencies.every(dependency => servicesKeys.includes(dependency));
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
  return Object.values(services).filter(service => service.dependencies.includes(name)).map(service => service.name);
}

function createContainer(initialServices) {
  const services = {};

  if (initialServices) {
    Object.entries(initialServices).sort(byDependency).forEach(([key, service]) => {
      add(key, service);
    });
  }

  return {
    add,
    get,
    getSingleton,
    remove,
    services
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
        order
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
        order
      };
    }

    return true;
  }

  function get(name) {
    var _a, _b;

    if (!services[name]) {
      throw new Error(`Service ${name} does not exist.`);
    }

    if (!((_a = services[name]) === null || _a === void 0 ? void 0 : _a.instance)) {
      instantiate(name);
    }

    return (_b = services[name]) === null || _b === void 0 ? void 0 : _b.instance;
  }

  function getSingleton(name) {
    if (!services[name]) {
      throw new Error(`Service ${name} does not exist.`);
    }

    return instantiate(name, true);
  }

  function instantiate(name, singleton = false) {
    var _a, _b;

    if (!services[name]) {
      throw new Error('Service does not exist');
    }

    if (services[name].instance && !singleton) {
      return services[name].instance;
    }

    const dependencies = ((_a = services[name]) === null || _a === void 0 ? void 0 : _a.dependencies) ? (_b = services[name]) === null || _b === void 0 ? void 0 : _b.dependencies.map(dependency => instantiate(dependency)) : [];
    const instance = services[name].constructor(...(dependencies || []));

    if (!singleton) {
      services[name].instance = instance;
    }

    return instance;
  }

  function remove(name) {
    var _a, _b, _c;

    if (!services[name]) {
      return null;
    }

    if (getDependents(name, services).length) {
      return null;
    }

    (_c = (_b = (_a = services[name]) === null || _a === void 0 ? void 0 : _a.instance) === null || _b === void 0 ? void 0 : _b.destroy) === null || _c === void 0 ? void 0 : _c.call(_b);
    delete services[name];
    return true;
  }
}

async function createModules(collection, app, container) {
  const routeMap = new Map();
  const constructorsMap = new Map();
  const activeModulesMap = new Map();
  const queue = createAsyncQueue();
  routeMap.set(toRouteString('all'), []);
  (Object.entries(collection) || []).forEach(([name, constructor]) => add(name, constructor));
  await onRouteEnter({
    name: 'all',
    params: null
  });
  return {
    add,
    get,
    getDynamic,
    onRouteEnter,
    remove
  };

  function add(name, constructor) {
    if (typeof constructor === 'object') {
      const {
        module,
        routes
      } = constructor;

      if (!module || !(routes === null || routes === void 0 ? void 0 : routes.length)) {
        return null;
      }

      routes.map(toRouteString).forEach(routeString => {
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
    activeModulesMap.set(name, constructor(app, container));
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
    moduleNames.forEach(name => {
      if (!activeModulesMap.has(name)) {
        const constructor = constructorsMap.get(name);

        if (!constructor) {
          return false;
        }

        activeModulesMap.set(name, constructor(app, container));
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
      (_b = (_a = await activeModulesMap.get(name)) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a);
      activeModulesMap.delete(name);
    }

    return constructorsMap.delete(name);
  }
}

function toRouteString(route) {
  const routeObj = typeof route === 'object' ? route : {
    name: route,
    params: null
  };
  return JSON.stringify(routeObj, replacer);
}

function replacer(k, value) {
  return value instanceof Object && !(value instanceof Array) ? Object.keys(value).sort().reduce((sorted, key) => {
    sorted[key] = value[key];
    return sorted;
  }, {}) : value;
}

async function createAppBuilder({
  baseRoute,
  createMounter,
  createRouter,
  el,
  layout: createLayout,
  modules: modulesCollection = {},
  routes = {},
  services: servicesCollection,
  views: viewsCollection
}) {
  const router = createRouter(baseRoute, routes);
  const services = createContainer(servicesCollection);
  const app = createContainer({
    dispatch: () => dispatch,
    hooks: createEventEmitter,
    router: () => router
  });
  const layout = createLayout(el, app, services);
  const mounter = createMounter(app, services, viewsCollection, '[data-view-id]');
  const queue = createAsyncQueue();
  const modules = await createModules(modulesCollection, app, services);
  router.addListener(Router.Events.Transition, () => {
    queue.add(modules.onRouteEnter, router.getCurrentRoute());
    dispatch();
  });
  return {
    app,
    services
  };

  function dispatch(moduleName, action, data) {
    queue.add(queuedDispatch, moduleName, action, data);
    queue.flush();
  }

  async function queuedDispatch(moduleName, action, data) {
    var _a;

    const hooks = app.get('hooks');
    const hookData = {
      module: moduleName,
      action,
      data
    };
    await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('beforeModule', hookData));

    if (moduleName && action) {
      let module = modules.get(moduleName);

      if (!module) {
        module = await modules.getDynamic(moduleName);
      }

      if (module) {
        (_a = module.actions) === null || _a === void 0 ? void 0 : _a[action](data);
      }
    }

    await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('beforeLayout', hookData));
    await layout.update(app, services);
    await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('beforeMounter', hookData));
    await mounter.run();
    await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('afterMounter', hookData));
  }
}

function createMounter(app, container, views, selector = '[data-view-id]', attribute = 'data-view-id') {
  const mountedViews = new Map();
  return {
    run
  };

  function getCurrentDOMRoots() {
    const currentDOMRoots = new Map();
    Array.from(document.querySelectorAll(`${selector}`)).forEach(el => {
      const elAttribute = el.getAttribute(attribute);

      if (elAttribute === null) {
        return;
      }

      currentDOMRoots.set(elAttribute, el);
    });
    return currentDOMRoots;
  }

  function getMounts() {
    const currentDOMRoots = getCurrentDOMRoots();
    const toMount = [];
    const mountedViewsCopy = new Map(mountedViews);
    currentDOMRoots.forEach((el, viewId) => {
      if (!viewId) {
        throw Error('viewId not found');
      }

      if (!mountedViewsCopy.has(viewId)) {
        toMount.push({
          el,
          viewId
        });
      } else {
        mountedViewsCopy.delete(viewId);
      }
    });
    const toUnmount = Array.from(mountedViews).filter(([viewId, el]) => mountedViewsCopy.has(viewId)).map(([viewId, el]) => ({
      el,
      viewId
    }));
    return {
      toMount,
      toUnmount
    };
  }

  async function run() {
    const {
      toMount,
      toUnmount
    } = getMounts();
    await Promise.all(toUnmount.map(({
      viewId
    }) => {
      const mountedView = mountedViews.get(viewId);

      if (!mountedView) {
        return Promise.resolve(null);
      }

      const [el, view] = mountedView;
      const unmountPromise = view.unmount(el, container);
      mountedViews.delete(viewId);
      return unmountPromise;
    }));
    await Promise.all(toMount.map(async function mountView({
      el,
      viewId
    }) {
      const viewConstructor = views[viewId];

      if (!viewConstructor) {
        return Promise.resolve(null);
      }

      const view = await viewConstructor(app, container);
      mountedViews.set(viewId, [el, view]);
      return view.mount(el, container);
    }));
  }
}

async function createApp({
  baseRoute,
  el,
  layout,
  modules: modulesCollection,
  routes,
  services: servicesCollection,
  views: viewsCollection
}) {
  return createAppBuilder({
    baseRoute,
    el,
    layout,
    modules: modulesCollection,
    createMounter,
    createRouter,
    routes,
    services: servicesCollection,
    views: viewsCollection
  });
}

var types = /*#__PURE__*/Object.freeze({
  __proto__: null
});
exports.Layout = types;
var types$1 = /*#__PURE__*/Object.freeze({
  __proto__: null
});
exports.Modules = types$1;
var types$2 = /*#__PURE__*/Object.freeze({
  __proto__: null
});
exports.Mounter = types$2;
var types$3 = /*#__PURE__*/Object.freeze({
  __proto__: null
});
exports.Views = types$3;
var types$4 = /*#__PURE__*/Object.freeze({
  __proto__: null
});
exports.App = types$4;

function createStoreModule(app, services) {
  const hooks = app.get('hooks');
  const store = services.get('store');

  if (!store) {
    throw new Error('Store service does not exist.');
  }

  hooks.addListener('beforeModule', pauseUpdates);
  hooks.addListener('afterMounter', resumeUpdates);
  return {
    destroy
  };

  function destroy() {
    hooks === null || hooks === void 0 ? void 0 : hooks.removeListener('beforeModule', pauseUpdates);
    hooks === null || hooks === void 0 ? void 0 : hooks.removeListener('afterMounter', resumeUpdates);
  }

  function pauseUpdates() {
    store === null || store === void 0 ? void 0 : store.pause();
  }

  function resumeUpdates() {
    store === null || store === void 0 ? void 0 : store.resume();
  }
}
},{}],"crux/todos.module.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTodosModule = createTodosModule;

function createTodosModule(app, container) {
  const todos = container.get('todos');
  const store = container.get('store');

  if (!todos || !store) {
    throw new Error('todoList or store service not provided');
  }

  return {
    actions: {
      addTodo: todos.addTodo,
      removeCompleted: todos.removeCompleted,
      removeTodo: todos.removeTodo,
      toggleComplete: todos.toggleComplete
    }
  };
}
},{}],"../../../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"../../../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.insertBefore(start, before);
    start = n;
  }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"../../../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"../../../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(element.content, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false); // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.

    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;

    while (partIndex < length) {
      const node = walker.nextNode();

      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      if (node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {
              length
            } = attributes; // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.

            let count = 0;

            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }

            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex]; // Find the attribute name

              const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.

              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
              partIndex += statics.length - 1;
            }
          }

          if (node.tagName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          const data = node.data;

          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];

              if (s === '') {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);

                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }

                insert = document.createTextNode(s);
              }

              parent.insertBefore(insert, node);
              this.parts.push({
                type: 'node',
                index: ++index
              });
            } // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.


            if (strings[lastIndex] === '') {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            } // We have a part for each match found


            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8
      /* Node.COMMENT_NODE */
      ) {
          if (node.data === marker) {
            const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part

            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }

            lastPartIndex = index;
            this.parts.push({
              type: 'node',
              index
            }); // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.

            if (node.nextSibling === null) {
              node.data = '';
            } else {
              nodesToRemove.push(node);
              index--;
            }

            partIndex++;
          } else {
            let i = -1;

            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({
                type: 'node',
                index: -1
              });
              partIndex++;
            }
          }
        }
    } // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = // eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"../../../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari does not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(fragment, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode(); // Loop through all the nodes and parts of a template

    while (partIndex < parts.length) {
      part = parts[partIndex];

      if (!(0, _template.isTemplatePartActive)(part)) {
        this.__parts.push(undefined);

        partIndex++;
        continue;
      } // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.


      while (nodeIndex < part.index) {
        nodeIndex++;

        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }

        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      } // We've arrived at our part's node.


      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);

        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }

      partIndex++;
    }

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../../../node_modules/lit-html/lib/dom.js","./template.js":"../../../node_modules/lit-html/lib/template.js"}],"../../../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes && trustedTypes.createPolicy('lit-html', {
  createHTML: s => s
});
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment position.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.

      const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.

      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.

      const attributeMatch = _template.lastAttributeNameRegex.exec(s);

      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
      }
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    let value = this.getHTML();

    if (policy !== undefined) {
      // this is secure because `this.strings` is a TemplateStringsArray.
      // TODO: validate this when
      // https://github.com/tc39/proposal-array-is-template-object is
      // implemented.
      value = policy.createHTML(value);
    }

    template.innerHTML = value;
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../../../node_modules/lit-html/lib/dom.js","./template.js":"../../../node_modules/lit-html/lib/template.js"}],"../../../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isIterable = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};

exports.isPrimitive = isPrimitive;

const isIterable = value => {
  return Array.isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */


exports.isIterable = isIterable;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    const parts = this.parts; // If we're assigning an attribute via syntax like:
    //    attr="${foo}"  or  attr=${foo}
    // but not
    //    attr="${foo} ${bar}" or attr="${foo} baz"
    // then we don't want to coerce the attribute value into one long
    // string. Instead we want to just return the value itself directly,
    // so that sanitizeDOMValue can get the actual value rather than
    // String(value)
    // The exception is if v is an array, in which case we do want to smash
    // it together into a string without calling String() on the array.
    //
    // This also allows trusted values (when using TrustedTypes) being
    // assigned to DOM sinks without being stringified in the process.

    if (l === 1 && strings[0] === '' && strings[1] === '') {
      const v = parts[0].value;

      if (typeof v === 'symbol') {
        return String(v);
      }

      if (typeof v === 'string' || !isIterable(v)) {
        return v;
      }
    }

    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
/**
 * A Part that controls all or part of an attribute value.
 */


exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */


exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part.__insert(this.startNode = (0, _template.createMarker)());

    part.__insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref.__insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    if (this.startNode.parentNode === null) {
      return;
    }

    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    const value = this.__pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }

  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  __commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this.__insert(value);

    this.value = value;
  }

  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.

    const valueAsString = typeof value === 'string' ? value : String(value);

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }

    this.value = value;
  }

  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this.__commitNode(fragment);

      this.value = instance;
    }
  }

  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const value = !!this.__pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }

      this.value = value;
    }

    this.__pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // eslint-disable-next-line @typescript-eslint/no-explicit-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false; // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module

(() => {
  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    window.addEventListener('test', options, options); // eslint-disable-next-line @typescript-eslint/no-explicit-any

    window.removeEventListener('test', options, options);
  } catch (_e) {// event options not supported
  }
})();

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    this.value = newListener;
    this.__pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../../../node_modules/lit-html/lib/directive.js","./dom.js":"../../../node_modules/lit-html/lib/dom.js","./part.js":"../../../node_modules/lit-html/lib/part.js","./template-instance.js":"../../../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../../../node_modules/lit-html/lib/template-result.js","./template.js":"../../../node_modules/lit-html/lib/template.js"}],"../../../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const committer = new _parts.AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"../../../node_modules/lit-html/lib/parts.js"}],"../../../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"../../../node_modules/lit-html/lib/template.js"}],"../../../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"../../../node_modules/lit-html/lib/dom.js","./parts.js":"../../../node_modules/lit-html/lib/parts.js","./template-factory.js":"../../../node_modules/lit-html/lib/template-factory.js"}],"../../../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isIterable", {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @packageDocumentation
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.3.0');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */


const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"../../../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../../../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../../../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../../../node_modules/lit-html/lib/dom.js","./lib/part.js":"../../../node_modules/lit-html/lib/part.js","./lib/parts.js":"../../../node_modules/lit-html/lib/parts.js","./lib/render.js":"../../../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../../../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../../../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../../../node_modules/lit-html/lib/template.js"}],"crux/todos.layout.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLayout = createLayout;

var _litHtml = require("lit-html");

function createLayout(el) {
  return {
    update
  };

  function template() {
    return (0, _litHtml.html)`
      <section class="todoapp" data-view-id="todos"></section>
      <footer class="footer" data-view-id="footerNav"></footer>
      <footer class="info">
        <p>Double-click to edit a todo</p>
      </footer>
    `;
  }

  function update() {
    (0, _litHtml.render)(template(), el);
  }
}
},{"lit-html":"../../../node_modules/lit-html/lit-html.js"}],"todos/todos.model.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTodos = createTodos;

function createTodos(store) {
  store.update(function add(state) {
    state.todos = [{
      text: 'initial',
      completed: false
    }, {
      text: 'second',
      completed: true
    }];
    return state;
  });
  return {
    addTodo,
    removeCompleted,
    removeTodo,
    toggleComplete
  };

  function addTodo(text) {
    store.update(function add(state) {
      state.todos = [...state.todos, {
        completed: false,
        text
      }];
      return state;
    });
  }

  function removeCompleted() {
    store.update(function remove(state) {
      state.todos = state.todos.filter((todo, index) => !todo.completed);
      return state;
    });
  }

  function removeTodo(index) {
    store.update(function remove(state) {
      state.todos = state.todos.filter((todo, ndx) => ndx !== index);
      return state;
    });
  }

  function toggleComplete(index) {
    store.update(function toggle(state) {
      state.todos = [...state.todos];
      state.todos[index].completed = !state.todos[index].completed;
      return state;
    });
  }
}
},{}],"../../../node_modules/@crux/state/dist/state.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;

function createSyncQueue() {
  const entries = [];
  let flushing = false;
  return {
    add,
    flush
  };

  function add(fn, ...params) {
    entries.push({
      fn,
      params
    });
  }

  function flush() {
    if (flushing) {
      return;
    }

    const entry = entries.shift();

    if (!entry) {
      flushing = false;
      return;
    }

    flushing = true;
    entry.fn(...entry.params);

    if (entries.length) {
      return flush();
    }
  }
}

function createStore(initialState) {
  const state = { ...initialState
  };
  const queue = createSyncQueue();
  let paused = false;
  const subscribers = [];
  return {
    pause,
    resume,
    state,
    subscribe,
    subscribers,
    update
  };

  function subscribe(selector, callback) {
    const initialValue = selector(state);
    const newSubscriber = {
      callback,
      currentValue: initialValue,
      selector
    };
    subscribers.push(newSubscriber);
    return {
      initialValue,
      unsubscribe
    };

    function unsubscribe() {
      const index = subscribers.indexOf(newSubscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    }
  }

  function notify() {
    subscribers.forEach(subscriber => {
      const newValue = subscriber.selector(state);

      if (newValue !== subscriber.currentValue) {
        queue.add(subscriber.callback, newValue);
        subscriber.currentValue = newValue;
      }
    });

    if (!paused) {
      queue.flush();
    }
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
    queue.flush();
  }

  function update(callback) {
    Object.assign(state, callback(state));
    notify();
  }
}
},{}],"../../../node_modules/@crux/lit-html/dist/lit-html.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLitHtmlModule = createLitHtmlModule;
exports.LitHtml = void 0;
var types = /*#__PURE__*/Object.freeze({
  __proto__: null
});
exports.LitHtml = types;

function createLitHtmlModule(app) {
  const router = app.get('router');
  app.add('link', () => createLink);
  return {};

  function createLink(html) {
    return function link({
      classname,
      params = null,
      route,
      text
    }) {
      return html`<a
        href
        classname="${classname !== null && classname !== void 0 ? classname : ''}"
        @click="${e => navigate(route, params, e)}"
        >${text}</a
      >`;
    };
  }

  function navigate(route, params, event) {
    event.stopPropagation();
    event.preventDefault();
    router.navigate(route, params);
  }
}
},{}],"../../../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;

function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }

  var id = bundles[bundles.length - 1];

  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }

    throw err;
  }
}

function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}

var bundleLoaders = {};

function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}

module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};

function loadBundle(bundle) {
  var id;

  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }

  if (bundles[bundle]) {
    return bundles[bundle];
  }

  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];

  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }

      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}

function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}

LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};

LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"../../../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"index.ts":[function(require,module,exports) {
"use strict";

var _app = require("@crux/app");

var _todos = require("./crux/todos.module");

var _todos2 = require("./crux/todos.layout");

var _todos3 = require("./todos/todos.model");

var _state = require("@crux/state");

var _litHtml = require("@crux/lit-html");

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

(0, _app.createApp)({
  baseRoute: '',
  el: appEl,
  layout: _todos2.createLayout,
  modules: {
    litHtml: _litHtml.createLitHtmlModule,
    store: _app.createStoreModule,
    todos: _todos.createTodosModule
  },
  routes: {
    active: '/active',
    completed: '/completed'
  },
  services: {
    store: _state.createStore,
    todos: [_todos3.createTodos, 'store']
  },
  views: {
    footerNav: (app, services) => require("_bundle_loader")(require.resolve('./crux/footer-nav.view')).then(mod => mod.footerNav(app, services)),
    todos: (app, services) => require("_bundle_loader")(require.resolve('./crux/todos.view')).then(mod => mod.todos(services))
  }
}).then(({
  app
}) => app.get('dispatch')());
},{"@crux/app":"../node_modules/@crux/app/dist/app.mjs","./crux/todos.module":"crux/todos.module.ts","./crux/todos.layout":"crux/todos.layout.ts","./todos/todos.model":"todos/todos.model.ts","@crux/state":"../../../node_modules/@crux/state/dist/state.mjs","@crux/lit-html":"../../../node_modules/@crux/lit-html/dist/lit-html.mjs","_bundle_loader":"../../../node_modules/parcel-bundler/src/builtins/bundle-loader.js","./crux/footer-nav.view":[["footer-nav.view.3a0578f0.js","crux/footer-nav.view.ts"],"footer-nav.view.3a0578f0.js.map","crux/footer-nav.view.ts"],"./crux/todos.view":[["todos.view.3861059d.js","crux/todos.view.ts"],"todos.view.3861059d.js.map","crux/todos.view.ts"]}],"../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54475" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}],"../../../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;

    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };

    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("../../../node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("../../../node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));
},{}]},{},["../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0,"index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map