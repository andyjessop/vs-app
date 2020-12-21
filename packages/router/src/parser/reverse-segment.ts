import { isList } from './is-list';
import { isOptional } from './is-optional';
import { namedParamRegex } from './constants';
import type { Router } from '../router/types';

/**
 * Reverse-parse a segment.
 */
export function reverseSegment(str: string, dict: Router.RouteParams): string {
  // eslint-disable-next-line no-undef
  const match = str.match(namedParamRegex) || [];

  for (let i = 0; i < match.length; i++) {
    const m = match[i];

    const endIx = m.indexOf('<');

    let name = m.slice(1, endIx < 0 ? m.length : endIx);

    if (isOptional(name) || isList(name)) {
      name = name.slice(0, -1);
    }

    if (!(name in dict)) {
      throw new Error(`${name} ${undefined}`);
    }

    // eslint-disable-next-line no-param-reassign
    str = str.replace(m, dict[name] as any);
  }

  return str;
}
