import { isList } from './is-list';
import { isOptional } from './is-optional';
import { paramName } from './param-name';
import { parseSegment } from './parse-segment';
import type { Router } from '../router/types';

/**
 * Parse a query, returning a decodeURL function.
 */
export function parseQueries(target: URLSearchParams) {
  const keys = Array.from(target.keys());

  const parsers = keys.map((key) => parseSegment(target.get(key)!));

  return function curriedParseQueries(query: URLSearchParams, params: Router.RouteParams): boolean {
    const queryKeys = Array.from(query.keys());

    if (!keys.every((x) => isOptional(x) || isList(x) || queryKeys.includes(x))) {
      return false;
    }

    for (let i = 0; i < keys.length; i++) {
      const key = paramName(keys[i]);

      if (isList(keys[i])) {
        Array.from(query.entries())
          .filter((x) => x[0] === key)
          .forEach((x) => parsers[i](x[1], params, true));
      } else if (!parsers[i](query.get(key)!, params) && !isOptional(keys[i])) {
        return false;
      }
    }

    return true;
  };
}
