import { Constructor, ConstructorTuple } from './types';

type Entry = [string, Constructor | ConstructorTuple];

export function byDependency(a: Entry, b: Entry): 1 | -1 | 0 {
  const [aKey, aService] = a;
  const [bKey, bService] = b;

  if (typeof aService === 'function') {
    return -1;
  }

  if (typeof bService === 'function') {
    return 1;
  }

  if (aService.includes(bKey)) {
    return 1;
  }

  if (bService.includes(aKey)) {
    return -1;
  }

  return 0;
}
