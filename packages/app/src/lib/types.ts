import { Container } from '@crux/di';
import { Router } from '@crux/router';
import { EventEmitter } from '@crux/utils';
import { Layout, Modules, Mounter, Views } from '..';

export interface AppParams<T> {
  baseRoute: string;
  el: Element;
  layout: Layout.Constructor<T>;
  modules?: Modules.ConstructorCollection<T>;
  routes?: Router.RoutesConfig;
  services?: Container.ConstructorCollection<T>;
  views: Views.ConstructorCollection<T>;
}

export interface AppBuilderParams<T> extends AppParams<T> {
  createMounter: Mounter.Constructor<T>;
  createRouter: Router.Constructor;
}

export interface AppServices {
  dispatch(moduleName?: string | undefined, action?: string | undefined, data?: any): void;
  hooks: EventEmitter.API;
  router: Router.API;
}
