import { Collection } from './types';
export declare function getDependents<T>(name: keyof T, services: Collection<T>): (keyof T)[];
