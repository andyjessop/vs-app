import { Collection } from './types';

export function getDependents(name: string, services: Collection) {
  return Object.values(services)
    .filter((service) => service.dependencies.includes(name))
    .map((service) => service.name);
}
