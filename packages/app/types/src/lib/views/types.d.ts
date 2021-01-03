import { Container } from '@crux/di';
import { Services as AppServices } from '../types';
export declare type Mount<T> = (el: Element, container: Container.API<T>) => void;
export declare type Unmount<T> = Mount<T>;
export declare type View<T> = {
    mount: Mount<T>;
    unmount: Unmount<T>;
};
export declare type Collection<T> = Map<string, View<T>>;
export declare type Constructor<T> = (app: Container.API<AppServices>, container: Container.API<T>) => View<T> | Promise<View<T>>;
export declare type ConstructorCollection<T> = Record<string, Constructor<T>>;
