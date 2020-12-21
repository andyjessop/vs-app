/**
 * Transform a path to a URL.
 */
export function pathToURL(url: string) {
  return new URL(`ftp://x/${url}`);
}
