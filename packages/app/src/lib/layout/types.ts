import { Container } from '@crux/di';

export interface API {
  update(container: Container.API): Promise<void> | void;
}

export type Constructor = (el: Element, container: Container.API) => API;
