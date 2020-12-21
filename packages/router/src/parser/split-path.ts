import { trimSlashes } from './trim-slashes';

/**
 * Split a path into segments.
 */
export function splitPath(path: string) {
  return trimSlashes(path).split('/').map(decodeURIComponent);
}
