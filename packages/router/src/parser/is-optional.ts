/**
 * Determine if a path parameter is optional.
 */
export function isOptional(p: string) {
  return p.endsWith('?');
}
