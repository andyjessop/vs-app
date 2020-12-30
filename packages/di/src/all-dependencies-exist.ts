import { Collection } from './types';

export function allDependenciesExist(
  services: Collection,
  dependencies: string[],
) {
  const servicesKeys = Object.keys(services);
  return dependencies.every((dependency) => servicesKeys.includes(dependency));
}
