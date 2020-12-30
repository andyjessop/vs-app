import { ConstructorCollectionTuple } from './types';

export function byDependency(
  a: ConstructorCollectionTuple,
  b: ConstructorCollectionTuple,
) {
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
