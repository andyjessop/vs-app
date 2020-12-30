(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global.app = {})));
})(this, function (exports) {
  'use strict';

  function createEventEmitter() {
    const listeners = [];
    return {
      addListener,
      emit,
      removeListener,
    };
    function addListener(type, handler) {
      const listener = { handler, type };
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
        if (result.then) {
          promises.push(result);
        }
      }
      return Promise.all(promises);
    }
    function removeListener(type, handler) {
      const ndx = listeners.findIndex((l) => type === l.type && handler === l.handler);
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
    })((Events = Router.Events || (Router.Events = {})));
  })(Router || (Router = {}));

  function createEventEmitter$1() {
    const listeners = [];
    return {
      addListener,
      emit,
      removeListener,
    };
    function addListener(type, handler) {
      const listener = { handler, type };
      listeners.push(listener);
    }
    function emit(type, data) {
      let listener;
      for (listener of listeners) {
        if (listener.type !== type) {
          continue;
        }
        listener.handler(data);
      }
    }
    function removeListener(type, handler) {
      const ndx = listeners.findIndex((l) => type === l.type && handler === l.handler);
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
    const parsers = keys.map((key) => parseSegment(target.get(key)));
    return function curriedParseQueries(query, params) {
      const queryKeys = Array.from(query.keys());
      if (!keys.every((x) => isOptional(x) || isList(x) || queryKeys.includes(x))) {
        return false;
      }
      for (let i = 0; i < keys.length; i++) {
        const key = paramName(keys[i]);
        if (isList(keys[i])) {
          Array.from(query.entries())
            .filter((x) => x[0] === key)
            .forEach((x) => parsers[i](x[1], params, true));
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
      if (
        pp(splitPath(trimSlashes(route.pathname)), params) &&
        pq(route.searchParams, params) &&
        ph(getHash(route.hash), params)
      ) {
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
      result.pathname = segments.map((x) => reverseSegment(x, dict)).join('/');
      target.searchParams.forEach((regex, n) => {
        const name = paramName(n);
        if (isList(n)) {
          []
            .concat(dict[name])
            .filter(Boolean)
            .forEach((x) => {
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
    return { name: route.route.name, params: route.params };
  }

  function buildEvent({ last, next, type }) {
    return {
      last: getRouteData(last),
      next: getRouteData(next),
      type,
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
    [
      ['root', '/'],
      ['notFound', '/404'],
      ...Object.entries(initialRoutes),
    ].forEach(([name, path]) => register(name, path));
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
      replace,
    };
    function destroy() {
      window.removeEventListener('popstate', refreshCurrentRoute);
    }
    function createRoute(name, path) {
      return {
        decodeURL: parse(path),
        encodeURL: reverse(path),
        name,
      };
    }
    function getCurrentRoute() {
      return getRouteData(currentRoute);
    }
    function getMatchingRoute(url) {
      let params = null;
      const route = Object.values(routes).find((route) => {
        params = route.decodeURL(url);
        return params !== null;
      });
      if (!route) {
        return {
          params: null,
          route: routes.notFound,
        };
      }
      return {
        params,
        route,
      };
    }
    function refreshCurrentRoute() {
      const lastRoute = currentRoute;
      currentRoute = getMatchingRoute(window.location.href);
      emitter.emit(
        Router.Events.Transition,
        buildEvent({
          last: lastRoute,
          next: currentRoute,
          type: Router.Events.Transition,
        }),
      );
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
      currentRoute = { params, route };
      if (replace) {
        window.history.replaceState({ name: route.name, params }, '', fullURL);
      } else {
        window.history.pushState({ name: route.name, params }, '', fullURL);
      }
      emitter.emit(
        Router.Events.Transition,
        buildEvent({
          last: lastRoute,
          next: currentRoute,
          type: Router.Events.Transition,
        }),
      );
    }
  }

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
          (_a = await activeModulesMap.get(name)) === null || _a === void 0
            ? void 0
            : _a.destroy) === null || _b === void 0
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

  async function createAppBuilder({
    baseRoute,
    createMounter,
    createRouter,
    el,
    layout: createLayout,
    modules: modulesCollection,
    routes,
    services: servicesCollection,
    views: viewsCollection,
  }) {
    const router = createRouter(baseRoute, routes);
    const container = createContainer({
      hooks: createEventEmitter,
      router: () => router,
      ...servicesCollection,
    });
    const layout = createLayout(el, container);
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
      const hooks = container.get('hooks');
      const hookData = { module: moduleName, action, data };
      await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('beforeModule', hookData));
      if (moduleName && action) {
        let module = modules.get(moduleName);
        if (!module) {
          module = await modules.getDynamic(moduleName);
        }
        if (module) {
          module.actions[action](data);
        }
      }
      await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('beforeLayout', hookData));
      await layout.update(container);
      await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('beforeMounter', hookData));
      await mounter.run();
      await (hooks === null || hooks === void 0 ? void 0 : hooks.emit('afterMounter', hookData));
    }
  }

  function createMounter(
    container,
    views,
    selector = '[data-view-id]',
    attribute = 'data-view-id',
  ) {
    const mountedViews = new Map();
    return {
      run,
    };
    function getCurrentDOMRoots() {
      const currentDOMRoots = new Map();
      Array.from(document.querySelectorAll(`${selector}`)).forEach((el) => {
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
          toMount.push({ el, viewId });
        } else {
          mountedViewsCopy.delete(viewId);
        }
      });
      const toUnmount = Array.from(mountedViews)
        .filter(([viewId, el]) => mountedViewsCopy.has(viewId))
        .map(([viewId, el]) => ({ el, viewId }));
      return {
        toMount,
        toUnmount,
      };
    }
    async function run() {
      const { toMount, toUnmount } = getMounts();
      await Promise.all(
        toUnmount.map(({ viewId }) => {
          const mountedView = mountedViews.get(viewId);
          if (!mountedView) {
            return Promise.resolve(null);
          }
          const [el, view] = mountedView;
          const unmountPromise = view.unmount(el, container);
          mountedViews.delete(viewId);
          return unmountPromise;
        }),
      );
      await Promise.all(
        toMount.map(async function mountView({ el, viewId }) {
          const viewConstructor = views[viewId];
          if (!viewConstructor) {
            return Promise.resolve(null);
          }
          const view = await viewConstructor(container);
          mountedViews.set(viewId, [el, view]);
          return view.mount(el, container);
        }),
      );
    }
  }

  async function createApp({
    baseRoute,
    el,
    layout,
    modules: modulesCollection,
    routes,
    services: servicesCollection,
    views: viewsCollection,
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
      views: viewsCollection,
    });
  }

  var types = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  var types$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  var types$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  var types$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  var types$4 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  exports.App = types$4;
  exports.Layout = types;
  exports.Modules = types$1;
  exports.Mounter = types$2;
  exports.Views = types$3;
  exports.createApp = createApp;
  exports.createAppBuilder = createAppBuilder;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=app.js.map
