import { Container } from '@crux/di';
import * as Modules from './types';
export declare function createModules(collection: Modules.ConstructorCollection, container: Container.API): Promise<Modules.API>;
