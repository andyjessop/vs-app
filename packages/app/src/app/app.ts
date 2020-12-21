import { createAsyncQueue, createEventEmitter } from '@crux/utils';
import { Router } from '../../../router/src/router/types';
import type {
  Layout,
  Modules,
  Mounts,
  Mounted,
  View,
} from './types';

export function createApp<
  T extends Modules,
  U extends Record<string, View>,
>({
  layout, modules: initialModules, views: initialViews, router,
}: {
  layout: Layout;
  modules: T;
  router: Router.API;
  views: U;
}) {
  const modules = { ...initialModules };
  const views = { ...initialViews };

  const emitter = createEventEmitter();
  const queue = createAsyncQueue();
  const mounts = createMounts();

  router.addListener(Router.Events.Transition, () => dispatch());

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
    let event;

    // Handle the action in the primary module.
    if (module && action) {
      modules[module].actions[action](data);
    }

    layout.update(event);

    const { mount, unmount } = mounts.get();

    await Promise.all(unmount.map(({ el, viewId }) => views[viewId]?.unmount({ currentRoute, el, modules })));

    await Promise.all(mount.map(async ({ el, viewId }) => {
      views[viewId] = typeof views[viewId] === 'function'
        ? (await views[viewId]())
        : views[viewId];
        
      views[viewId]?.mount({ currentRoute, el, modules });
    }));


  }
}

function createMounts() {
  const mounted: Mounted = {};

  return {
    get,
  };

  function get(): Mounts {
    const views = Array.from(document.querySelectorAll('[data-view-id]'));

    let mount: { el: Element, viewId: string }[] = [];

    const mountedCopy = { ...mounted };

    views.forEach(view => {
      const viewId = view.getAttribute('data-view-id');

      if (!viewId) {
        throw Error('viewId not found');
      }

      if (!mounted[viewId]) {
        mounted[viewId] = view;
        mount.push({ el: view, viewId });
      } else {
        delete mountedCopy[viewId];
      }
    });

    // Any remaining views in mountedCopy are to be unmounted
    const unmount = Object.entries(mountedCopy)
      .map(([viewId, el]) => {
        delete mounted[viewId];
        
        return { el, viewId };
      });

    return {
      mount, unmount,
    };
  }
  
}

function getInitialState(obj: Modules) {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    acc[key] = val.initialState;
  }, <any>{});
}