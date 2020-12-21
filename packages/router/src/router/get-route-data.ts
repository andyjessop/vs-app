import type { Router } from './types';

export function getRouteData(
  route: Router.CurrentRoute | null | undefined,
): Router.RouteData | null {
  if (!route) {
    return null;
  }

  return { name: route.route.name, params: route.params };
}
