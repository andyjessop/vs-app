import { isList } from './is-list';
import { isOptional } from './is-optional';

/**
 * Get the parameter name from a path parameter.
 */
export function paramName(n: string) {
  if (isOptional(n) || isList(n)) {
    return n.slice(0, -1);
  }
  return n;
}
