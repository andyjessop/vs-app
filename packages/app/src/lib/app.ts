import { createRouter, Router } from '@crux/router';
import { Container } from '@crux/di';
import * as Layout from './layout/types';
import * as Modules from './modules/types';
import * as Views from './views/types';
import { createAppBuilder } from './app-builder';
import { createMounter } from './mounter/mounter';

export async function createApp<T>({
  baseRoute,
  el,
  layout,
  modules: modulesCollection,
  routes,
  services: servicesCollection,
  views: viewsCollection,
}: {
  baseRoute: string;
  el: Element;
  layout: Layout.Constructor<T>;
  modules?: Modules.ConstructorCollection<T>;
  routes?: Router.RoutesConfig;
  services?: Container.ConstructorCollection<T>;
  views: Views.ConstructorCollection<T>;
}) {
  return createAppBuilder({
    baseRoute,
    el,
    layout,
    modules: modulesCollection,
    createMounter,
    createRouter,
    routes,
    services: servicesCollection,
    views: viewsCollection,
  });
}
