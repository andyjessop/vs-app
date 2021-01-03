import { Container } from '@crux/di';
import { Modules } from '../..';
import { AppServices } from '../types';
export declare function createStoreModule<T>(app: Container.API<AppServices>, services: Container.API<T>): Modules.Module;
