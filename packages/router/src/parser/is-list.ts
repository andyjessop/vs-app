/**
 * Determine if a path parameter is a list.
 */
export function isList(p: string) {
  return p.endsWith('*');
}
