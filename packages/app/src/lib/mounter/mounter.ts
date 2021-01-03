import * as Mounter from './types';
import * as Views from '../views/types';
import { Container } from '@crux/di';
import type { AppServices } from '../types';

interface DOMRoot {
  el: Element;
  viewId: string;
}

export function createMounter<T>(
  app: Container.API<AppServices>,
  container: Container.API<T>,
  views: Views.ConstructorCollection<T>,
  selector: string = '[data-view-id]',
  attribute: string = 'data-view-id',
): Mounter.API {
  const mountedViews: Map<string, [Element, Views.View<T>]> = new Map();

  return {
    run,
  };

  function getCurrentDOMRoots() {
    const currentDOMRoots = new Map<string, Element>();

    Array.from(document.querySelectorAll(`${selector}`)).forEach((el) => {
      const elAttribute = el.getAttribute(attribute);

      if (elAttribute === null) {
        return;
      }

      currentDOMRoots.set(elAttribute, el);
    });

    return currentDOMRoots;
  }

  function getMounts() {
    const currentDOMRoots = getCurrentDOMRoots();

    const toMount: DOMRoot[] = [];

    const mountedViewsCopy = new Map(mountedViews);

    currentDOMRoots.forEach((el, viewId) => {
      if (!viewId) {
        throw Error('viewId not found');
      }

      if (!mountedViewsCopy.has(viewId)) {
        toMount.push({ el, viewId });
      } else {
        mountedViewsCopy.delete(viewId);
      }
    });

    const toUnmount = Array.from(mountedViews)
      // Any remaining in the copy should be unmounted
      .filter(([viewId, el]) => mountedViewsCopy.has(viewId))
      .map(([viewId, el]) => ({ el, viewId }));

    return {
      toMount,
      toUnmount,
    };
  }

  async function run() {
    const { toMount, toUnmount } = getMounts();

    await Promise.all(
      toUnmount.map(({ viewId }) => {
        const mountedView = mountedViews.get(viewId);

        if (!mountedView) {
          return Promise.resolve(null);
        }

        const [el, view] = mountedView;

        const unmountPromise = view.unmount(el, container);

        mountedViews.delete(viewId);

        return unmountPromise;
      }),
    );

    await Promise.all(
      toMount.map(async function mountView({ el, viewId }) {
        const viewConstructor = views[viewId];

        if (!viewConstructor) {
          return Promise.resolve(null);
        }

        const view = await viewConstructor(app, container);

        mountedViews.set(viewId, [el, view]);

        return view.mount(el, container);
      }),
    );
  }
}
