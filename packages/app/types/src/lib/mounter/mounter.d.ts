import * as Mounter from './types';
import * as Views from '../views/types';
import { Container } from '@crux/di';
import type { AppServices } from '../types';
export declare function createMounter<T>(app: Container.API<AppServices>, container: Container.API<T>, views: Views.ConstructorCollection<T>, selector?: string, attribute?: string): Mounter.API;
