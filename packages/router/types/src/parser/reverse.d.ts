import type { Router } from '../router/types';
/**
 * Reverse a pattern, returning an encodeURL function.
 */
export declare function reverse(pattern: string): (dict: Router.RouteParams) => string;
