import { Container } from '@crux/di';
export declare type Mount = (el: Element, container: Container.API) => void;
export declare type Unmount = Mount;
export declare type View = {
    mount: Mount;
    unmount: Unmount;
};
export declare type Collection = Map<string, View>;
export declare type Constructor = (container: Container.API) => View | Promise<View>;
export declare type ConstructorCollection = Record<string, Constructor>;
