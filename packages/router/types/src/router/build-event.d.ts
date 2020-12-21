import type { Router } from './types';
/**
 * Build an event object.
 */
export declare function buildEvent({ last, next, type, }: {
    last: Router.CurrentRoute | null | undefined;
    next: Router.CurrentRoute | null | undefined;
    type: Router.Events;
}): {
    last: Router.RouteData | null;
    next: Router.RouteData | null;
    type: Router.Events;
};
