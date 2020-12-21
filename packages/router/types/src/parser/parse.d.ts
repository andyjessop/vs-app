import type { Router } from '../router/types';
/**
 * Parse a pattern, returning a decodeURL function.
 */
export declare function parse(pattern: string): (urlString: string) => null | Router.RouteParams;
