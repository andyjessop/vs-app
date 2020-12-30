import { createAsyncQueue, createEventEmitter, EventEmitter } from '@crux/utils';
import { Router } from '@crux/router';
import { Container, createContainer } from '@crux/di';
import * as Layout from './layout/types';
import * as Modules from './modules/types';
import * as Mounter from './mounter/types';
import * as Views from './views/types';
import { createModules } from './modules/modules';

export async function createAppBuilder({
  baseRoute,
  createMounter,
  createRouter,
  el,
  layout: createLayout,
  modules: modulesCollection,
  routes,
  services: servicesCollection,
  views: viewsCollection,
}: {
  baseRoute: string;
  createMounter: Mounter.Constructor;
  el: Element;
  layout: Layout.Constructor;
  modules: Modules.ConstructorCollection;
  routes: Router.RoutesConfig;
  createRouter: Router.Constructor;
  services?: Container.ConstructorCollection;
  views: Views.ConstructorCollection;
}) {
  const router = createRouter(baseRoute, routes);

  const container = createContainer({
    hooks: createEventEmitter,
    router: () => router,
    ...servicesCollection,
  });

  const layout = createLayout(el, container);

  const mounter = createMounter(container, viewsCollection, '[data-view-id]');

  const queue = createAsyncQueue();

  const modules = await createModules(modulesCollection, container);

  router.addListener(Router.Events.Transition, () => {
    queue.add(modules.onRouteEnter, router.getCurrentRoute());

    dispatch();
  });

  return {
    dispatch,
    router,
  };

  function dispatch(moduleName?: string, action?: string, data?: any) {
    queue.add(queuedDispatch, moduleName, action, data);

    queue.flush();
  }

  async function queuedDispatch(moduleName?: string, action?: string, data?: any) {
    const hooks = container.get<EventEmitter.API>('hooks');
    const hookData = { module: moduleName, action, data };

    await hooks?.emit('beforeModule', hookData);

    // Handle the action in the primary module.
    if (moduleName && action) {
      let module = modules.get(moduleName);

      if (!module) {
        module = await modules.getDynamic(moduleName);
      }

      if (module) {
        module.actions?.[action](data);
      }
    }

    await hooks?.emit('beforeLayout', hookData);

    await layout.update(container);

    await hooks?.emit('beforeMounter', hookData);

    await mounter.run();

    await hooks?.emit('afterMounter', hookData);
  }
}
