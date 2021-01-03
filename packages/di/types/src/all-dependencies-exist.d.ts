import { Collection } from './types';
export declare function allDependenciesExist<T>(services: Collection<T>, dependencies: (keyof T)[]): boolean;
