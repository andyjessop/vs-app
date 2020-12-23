import { Mounts, Mounted } from './types';

export function createMounter(selector: string) {
  const mounted: Mounted = {};

  return {
    get,
  };

  function get(): Mounts {
    const views = Array.from(document.querySelectorAll(`${selector}`));

    const mount: { el: Element; viewId: string }[] = [];

    const mountedCopy = { ...mounted };

    views.forEach((view) => {
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
    const unmount = Object.entries(mountedCopy).map(([viewId, el]) => {
      delete mounted[viewId];

      return { el, viewId };
    });

    return {
      mount,
      unmount,
    };
  }
}
