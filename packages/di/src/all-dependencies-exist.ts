import { Collection } from './types';

export function allDependenciesExist<T>(
  services: Collection<T>,
  dependencies: (keyof T)[],
) {
  const servicesKeys = <(keyof T)[]>Object.keys(services);
  return dependencies.every((dependency) => servicesKeys.includes(dependency));
}
