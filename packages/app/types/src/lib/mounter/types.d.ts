import { Container } from '@crux/di';
import * as Views from '../views/types';
export interface API {
    run(): Promise<void>;
}
export declare type Constructor = (container: Container.API, views: Views.ConstructorCollection, selector?: string) => API;
export declare type MountedViews = Map<string, Views.View>;
