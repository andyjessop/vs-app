import { Container } from '@crux/di';
import { Router } from '@crux/router';

export function post() {
  return {
    mount,
    unmount,
  };

  async function mount(el: Element, container: Container.API) {
    const route = container.get<Router.API>('router')?.getCurrentRoute();

    if (!route) {
      el.innerHTML = 'No route';
      return;
    }

    el.innerHTML = `Post: ${route.params.id}`;
  }

  async function unmount(el: Element, container: Container.API) {}
}
