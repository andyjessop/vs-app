import { escapeRegexes } from './escape-regexes';
import { getHash } from './get-hash';
import { parsePaths } from './parse-paths';
import { parseQueries } from './parse-queries';
import { parseSegment } from './parse-segment';
import { pathToURL } from './path-to-url';
import type { Router } from '../router/types';
import { splitPath } from './split-path';
import { trimSlashes } from './trim-slashes';

/**
 * Parse a pattern, returning a decodeURL function.
 */
export function parse(pattern: string) {
  if (pattern[0] !== '/') {
    throw new Error('Must start with /');
  }

  const target = pathToURL(escapeRegexes(trimSlashes(pattern)));

  const targetSegments = splitPath(trimSlashes(target.pathname));

  const targetHash = getHash(target.hash);

  const pq = parseQueries(target.searchParams);

  const pp = parsePaths(targetSegments);

  const ph = parseSegment(targetHash);

  return function decodeURL(urlString: string): null | Router.RouteParams {
    const route = new URL(urlString);

    const params: Router.RouteParams = {};

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
