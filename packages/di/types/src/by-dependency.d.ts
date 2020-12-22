import { Constructor, ConstructorTuple } from './types';
declare type Entry = [string, Constructor | ConstructorTuple];
export declare function byDependency(a: Entry, b: Entry): 1 | -1 | 0;
export {};
