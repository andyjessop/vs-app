import { Router } from './types';
import { createEventEmitter, EventEmitter } from '@crux/utils';
import { parse, reverse } from '../parser';
import { trimSlashes } from '../parser/trim-slashes';
import { getRouteData } from './get-route-data';
import { buildEvent } from './build-event';
import { paramsToStrings } from './params-to-strings';

/**
 * Create a router.
 */
export function createRouter(
  base: string,
  initialRoutes: Record<string, string>,
  emitter: EventEmitter.API = createEventEmitter(),
): Router.API {
  const trimmedBase = trimSlashes(base);
  const routes: Router.Routes = {};

  // Register the initial routes, including the "root" route.
  [['root', '/'], ['notFound', '/404'], ...Object.entries(initialRoutes)].forEach(([name, path]) =>
    register(name, path),
  );

  let currentRoute: Router.CurrentRoute | null = getMatchingRoute(window.location.href);

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

  /**
   * Destroy the router.
   */
  function destroy() {
    window.removeEventListener('popstate', refreshCurrentRoute);
  }

  /**
   * Create a new route object on a given path.
   */
  function createRoute(name: string, path: string): Router.Route {
    return {
      decodeURL: parse(path),
      encodeURL: reverse(path),
      name,
    };
  }

  /**
   * Get the current route.
   */
  function getCurrentRoute(): Router.RouteData | null {
    return getRouteData(currentRoute);
  }

  /**
   * Get a route object matching a URL.
   */
  function getMatchingRoute(url: string): Router.CurrentRoute {
    let params: any | null = null;

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

  /**
   * Refresh the current route.
   */
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

  /**
   * Go forwards or backwards by a given number of steps.
   */
  function go(num: number) {
    window.history.go(num);
  }

  /**
   * Go backwards.
   */
  function back() {
    window.history.go(-1);
  }

  /**
   * Go forwards.
   */
  function forward() {
    window.history.go(1);
  }

  /**
   * Push a new route into the history.
   */
  function navigate(name: string, params: Router.RouteParams = {}): void {
    const route = routes[name];

    if (!route) {
      return transition(routes['404']);
    }

    transition(route, params);
  }

  /**
   * Register a route.
   */
  function register(name: string, path: string): true | null {
    if (typeof path === 'undefined' || typeof name === 'undefined') {
      return null;
    }

    routes[name] = createRoute(name, `${trimmedBase}${path}`);

    return true;
  }

  /**
   * Replace the current location history.
   */
  function replace(name: string, params: Router.RouteParams = {}): void {
    const route = routes[name];

    if (!route) {
      return transition(routes['404']);
    }

    transition(route, params, true);
  }

  /**
   * Transition to a new route.
   */
  function transition(route: Router.Route, params: Router.RouteParams = {}, replace = false): void {
    let url;

    try {
      // This is wrapped in a try/catch because encodeURL will throw if required parameters are not provided.
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
