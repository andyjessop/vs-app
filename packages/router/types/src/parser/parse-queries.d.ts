import type { Router } from '../router/types';
/**
 * Parse a query, returning a decodeURL function.
 */
export declare function parseQueries(target: URLSearchParams): (query: URLSearchParams, params: Router.RouteParams) => boolean;
