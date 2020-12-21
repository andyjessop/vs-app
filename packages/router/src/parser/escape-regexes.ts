import { namedParamRegex } from './constants';

/**
 * Escape named params from a pattern.
 */
export function escapeRegexes(pattern: string): string {
  const match = pattern.match(namedParamRegex) || [];

  for (let i = 0; i < match.length; i++) {
    const m = match[i];

    const regex = m.slice(m.indexOf('<') + 1, m.length - 1);

    // eslint-disable-next-line no-param-reassign
    pattern = pattern.replace(regex, encodeURIComponent(regex));
  }
  return pattern;
}
