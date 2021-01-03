import { Container } from '@crux/di';
import { AppServices } from '../types';
import * as Views from '../views/types';
export interface API {
    run(): Promise<void>;
}
export declare type Constructor<T> = (app: Container.API<AppServices>, container: Container.API<T>, views: Views.ConstructorCollection<T>, selector?: string) => API;
export declare type MountedViews<T> = Map<string, Views.View<T>>;
