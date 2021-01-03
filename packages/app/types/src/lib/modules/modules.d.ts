import { Container } from '@crux/di';
import { AppServices } from '../types';
import * as Modules from './types';
export declare function createModules<T>(collection: Modules.ConstructorCollection<T>, app: Container.API<AppServices>, container: Container.API<T>): Promise<Modules.API<T>>;
