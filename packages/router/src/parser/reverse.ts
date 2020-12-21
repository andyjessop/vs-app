import { escapeRegexes } from './escape-regexes';
import { isList } from './is-list';
import { isOptional } from './is-optional';
import { paramName } from './param-name';
import { pathToURL } from './path-to-url';
import { reverseSegment } from './reverse-segment';
import type { Router } from '../router/types';
import { splitPath } from './split-path';
import { trimSlashes } from './trim-slashes';

/**
 * Reverse a pattern, returning an encodeURL function.
 */
export function reverse(pattern: string) {
  const escapedString = escapeRegexes(trimSlashes(pattern));

  const target = pathToURL(escapedString);

  const segments = splitPath(target.pathname);

  return function encodeURL(dict: Router.RouteParams): string {
    const result = pathToURL('');

    result.pathname = segments.map((x) => reverseSegment(x, dict)).join('/');

    target.searchParams.forEach((regex, n) => {
      const name = paramName(n);

      if (isList(n)) {
        []
          .concat(dict[name] as any)
          .filter(Boolean)
          .forEach((x) => {
            result.searchParams.append(name, reverseSegment(x, dict));
          });
      } else if (!isOptional(n) || dict[name]) {
        result.searchParams.set(name, reverseSegment(regex, dict));
      }
    });

    result.hash = reverseSegment(decodeURIComponent(target.hash), dict);

    return `${result}`.replace('ftp://x', '');
  };
}
