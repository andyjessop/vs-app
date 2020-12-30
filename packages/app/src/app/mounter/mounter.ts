import * as Mounter from './types';
import * as Views from '../views/types';
import { Container } from '@crux/di';

interface DOMRoot {
  el: Element;
  viewId: string;
}

export function createMounter(
  container: Container.API,
  views: Views.ConstructorCollection,
  selector: string = '[data-view-id]',
): Mounter.API {
  const mountedViews: Map<string, [Element, Views.View]> = new Map();

  return {
    run,
  };

  function getCurrentDOMRoots() {
    const currentDOMRoots = new Map<string, Element>();

    Array.from(document.querySelectorAll(`${selector}`)).forEach((el) => {
      if (el.getAttribute(selector) === null) {
        return;
      }

      currentDOMRoots.set(<string>el.getAttribute(selector), el);
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
      toMount.map(({ el, viewId }) => {
        const viewConstructor = views[viewId];

        if (!viewConstructor) {
          return Promise.resolve(null);
        }

        const view = viewConstructor(container);

        mountedViews.set(viewId, [el, view]);

        return view.mount(el, container);
      }),
    );
  }
}
