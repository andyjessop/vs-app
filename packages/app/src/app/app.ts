import { createAsyncQueue, createEventEmitter } from '@crux/utils';
import { Router } from '@crux/router';
import { createContainer } from '@crux/di';
import type { Layout, Modules, View } from './types';
import { createMounter } from './mounter';

export async function createApp<T extends Modules, U extends Record<string, View>>({
  layout,
  modules: initialModules,
  views: initialViews,
  router,
}: {
  layout: Layout;
  modules: T;
  router?: Router.API;
  views: U;
}) {
  const coreRouter = await (router ??
    import('@crux/router').then((mod) => mod.createRouter('', {})));

  const container = createContainer({
    core: () => ({
      mounter: createMounter('[data-view-id]'),
      router: coreRouter,
    }),
  });

  const modules = { ...initialModules };
  const views = { ...initialViews };

  const emitter = createEventEmitter();
  const queue = createAsyncQueue();

  container.get('router').addListener(Router.Events.Transition, () => dispatch());

  return {
    ...emitter,
    dispatch,
    router,
  };

  function dispatch(module?: string, action?: string, data?: any) {
    queue.add(queuedDispatch, module, action, data);
    queue.flush();
  }

  async function queuedDispatch(module?: string, action?: string, data?: any) {
    const mounter = container.get('mounter');

    let event;

    // Handle the action in the primary module.
    if (module && action) {
      modules[module].actions[action](data);
    }

    layout.update(event, container);

    const { mount, unmount } = mounter.get();

    await Promise.all(
      unmount.map(({ el, viewId }) => views[viewId]?.unmount({ currentRoute, el, modules })),
    );

    await Promise.all(
      mount.map(async ({ el, viewId }) => {
        views[viewId] = typeof views[viewId] === 'function' ? await views[viewId]() : views[viewId];

        views[viewId]?.mount({ currentRoute, el, modules });
      }),
    );
  }
}

function getInitialState(obj: Modules) {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    acc[key] = val.initialState;
  }, <any>{});
}
