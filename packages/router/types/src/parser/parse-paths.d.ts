import type { Router } from '../router/types';
/**
 * Parse a path, returning a curried function.
 */
export declare function parsePaths(targets: string[]): (path: string[], params: Router.RouteParams) => boolean;
