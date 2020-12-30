import { createAsyncQueue } from '@crux/utils';
import { Router } from '@crux/router';
import { Container, createContainer } from '@crux/di';
import { Layout } from './types';
import * as Modules from './modules/types';
import * as Mounter from './mounter/types';
import * as Views from './views/types';
import { createModules } from './modules/modules';

export async function createApp({
  baseRoute,
  createMounter,
  createRouter,
  layout,
  modules: modulesCollection,
  routes,
  services: servicesCollection,
  views: viewsCollection,
}: {
  baseRoute: string;
  createMounter: Mounter.Constructor;
  layout: Layout;
  modules: Modules.ConstructorCollection;
  routes: Router.RoutesConfig;
  createRouter: Router.Constructor;
  services: Container.ConstructorCollection;
  views: Views.ConstructorCollection;
}) {
  const router = createRouter(baseRoute, routes);

  const container = createContainer({
    router: () => router,
    ...servicesCollection,
  });

  const views = createViews(viewsCollection);

  const mounter = createMounter(container, views, '[data-view-id]');

  const queue = createAsyncQueue();

  const modules = createModules(modulesCollection);

  router.addListener(Router.Events.Transition, () => {
    queue.add(modules.handleRouteTransition, router.getCurrentRoute());

    dispatch();
  });

  return {
    dispatch,
    router,
  };

  function dispatch(module?: string, action?: string, data?: any) {
    queue.add(queuedDispatch, module, action, data);

    queue.flush();
  }

  async function queuedDispatch(module?: string, action?: string, data?: any) {
    // Handle the action in the primary module.
    if (module && action) {
      modules.run(module, action, data);
    }

    await layout.update(container);

    await mounter.run();
  }
}
