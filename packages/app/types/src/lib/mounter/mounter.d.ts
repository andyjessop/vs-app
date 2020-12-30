import * as Mounter from './types';
import * as Views from '../views/types';
import { Container } from '@crux/di';
export declare function createMounter(container: Container.API, views: Views.ConstructorCollection, selector?: string, attribute?: string): Mounter.API;
