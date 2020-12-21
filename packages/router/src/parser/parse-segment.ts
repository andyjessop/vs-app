import type { Router } from '../router/types';

/**
 * Parse a segment, returning a decodeURL function.
 */
export function parseSegment(seg: string) {
  if (seg[0] === ':') {
    let regex: null | RegExp = null;

    const ndx = seg.indexOf('<');

    let name = seg.slice(1, seg.length);

    if (ndx >= 0) {
      if (seg[seg.length - 1] !== '>') {
        throw new Error('No closing >');
      }

      const regexStr = seg.slice(ndx + 1, seg.length - 1);

      regex = new RegExp(`^(${regexStr})$`);

      name = seg.slice(1, ndx);
    }

    return function curriedParseSegment(
      str: string,
      paths: Router.RouteParams,
      array = false,
    ): boolean {
      if (array) {
        paths[name] = [].concat((paths[name] as any) || [], str as any);
      } else {
        paths[name] = str;
      }

      return !(regex && !regex.test(str));
    };
  } else {
    return function curriedParseSegment(str: string): boolean {
      return str === seg;
    };
  }
}
