import { createAsyncQueue, createEventEmitter } from '@crux/utils';
import { Router } from '@crux/router';
import { Container, createContainer } from '@crux/di';
import * as Layout from './layout/types';
import * as Modules from './modules/types';
import * as Mounter from './mounter/types';
import * as Views from './views/types';
import { createModules } from './modules/modules';
import { AppServices } from './types';

export async function createAppBuilder<T>({
  baseRoute,
  createMounter,
  createRouter,
  el,
  layout: createLayout,
  modules: modulesCollection = {},
  routes = {},
  services: servicesCollection,
  views: viewsCollection,
}: {
  baseRoute: string;
  createMounter: Mounter.Constructor<T>;
  el: Element;
  layout: Layout.Constructor<T>;
  modules?: Modules.ConstructorCollection<T>;
  routes?: Router.RoutesConfig;
  createRouter: Router.Constructor;
  services?: Container.ConstructorCollection<T>;
  views: Views.ConstructorCollection<T>;
}) {
  const router = createRouter(baseRoute, routes);

  const services = createContainer(servicesCollection);

  const app = createContainer<AppServices>({
    dispatch: () => dispatch,
    hooks: createEventEmitter,
    router: () => router,
  });

  const layout = createLayout(el, app, services);

  const mounter = createMounter(app, services, viewsCollection, '[data-view-id]');

  const queue = createAsyncQueue();

  const modules = await createModules(modulesCollection, app, services);

  router.addListener(Router.Events.Transition, () => {
    queue.add(modules.onRouteEnter, router.getCurrentRoute());

    dispatch();
  });

  return {
    app,
    services,
  };

  function dispatch(moduleName?: string, action?: string, data?: any) {
    queue.add(queuedDispatch, moduleName, action, data);

    queue.flush();
  }

  async function queuedDispatch(moduleName?: string, action?: string, data?: any) {
    const hooks = app.get('hooks');
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

    await layout.update(app, services);

    await hooks?.emit('beforeMounter', hookData);

    await mounter.run();

    await hooks?.emit('afterMounter', hookData);
  }
}
