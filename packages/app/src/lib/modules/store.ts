import { Container } from '@crux/di';
import { EventEmitter } from '@crux/utils';
import { Store } from '@crux/state';
import { Modules } from '../..';

export function createStoreModule(container: Container.API): Modules.Module {
  const hooks = container.get<EventEmitter.API>('hooks');
  const store = container.get<Store<any>>('store');

  if (!hooks) {
    return {};
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
