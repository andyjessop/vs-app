import { Container } from '@crux/di';

export type Mount = (el: Element, container: Container.API) => void; // eslint-disable-line no-undef

export type Unmount = Mount;

export type View = {
  mount: Mount;
  unmount: Unmount;
};

export type Collection = Map<string, View>;

export type Constructor = (container: Container.API) => View;

export type ConstructorCollection = Record<string, Constructor>;
