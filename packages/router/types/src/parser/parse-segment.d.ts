import type { Router } from '../router/types';
/**
 * Parse a segment, returning a decodeURL function.
 */
export declare function parseSegment(seg: string): (str: string, paths: Router.RouteParams, array?: boolean) => boolean;
