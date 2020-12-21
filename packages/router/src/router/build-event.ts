import type { Router } from './types';
import { getRouteData } from './get-route-data';

/**
 * Build an event object.
 */
export function buildEvent({
  last,
  next,
  type,
}: {
  last: Router.CurrentRoute | null | undefined;
  next: Router.CurrentRoute | null | undefined;
  type: Router.Events;
}) {
  return {
    last: getRouteData(last),
    next: getRouteData(next),
    type,
  };
}
