var Router;
(function (Router) {
  let Events;
  (function (Events) {
    Events['Transition'] = 'transition';
  })((Events = Router.Events || (Router.Events = {})));
})(Router || (Router = {}));

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

function createRouter(base, initialRoutes, emitter = createEventEmitter()) {
  const trimmedBase = trimSlashes(base);
  const routes = {};
  [['root', '/'], ['notFound', '/404'], ...Object.entries(initialRoutes)].forEach(([name, path]) =>
    register(name, path),
  );
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

export { Router, createRouter };
//# sourceMappingURL=router.mjs.map
