import { Container } from '@crux/di';
import { Store } from '@crux/state';
import { Modules } from '../..';
import { Services as AppServices } from '../types';

export function createStoreModule<T>(
  app: Container.API<AppServices>,
  services: Container.API<T>,
): Modules.Module {
  const hooks = app.get('hooks');
  const store = <Store<any>>(<unknown>services.get(<keyof T>'store'));

  if (!store) {
    throw new Error('Store service does not exist.');
  }

  hooks.addListener('beforeModule', pauseUpdates);
  hooks.addListener('afterMounter', resumeUpdates);

  return {
    destroy,
  };

  function destroy() {
    hooks?.removeListener('beforeModule', pauseUpdates);
    hooks?.removeListener('afterMounter', resumeUpdates);
  }

  function pauseUpdates() {
    store?.pause();
  }

  function resumeUpdates() {
    store?.resume();
  }
}
