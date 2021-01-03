import { Container } from '@crux/di';
import { AppServices } from '../types';
export interface API<T> {
    update(app: Container.API<AppServices>, services: Container.API<T>): Promise<void> | void;
}
export declare type Constructor<T> = (el: Element, app: Container.API<AppServices>, services: Container.API<T>) => API<T>;
