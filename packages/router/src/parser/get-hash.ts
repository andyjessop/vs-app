/**
 * Get the hash component from a path.
 */
export function getHash(path: string) {
  return decodeURIComponent(path.replace(/^#/, ''));
}
