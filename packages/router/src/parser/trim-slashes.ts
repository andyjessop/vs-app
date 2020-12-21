/**
 * Trim leading and trailing slashes from a path.
 */
export function trimSlashes(p: string) {
  return p.replace(/(\/$)|(^\/)/g, '');
}
