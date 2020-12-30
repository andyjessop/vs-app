import { Container } from '@crux/di';

export function posts() {
  return {
    mount,
    unmount,
  };

  async function mount(el: Element, container: Container.API) {
    el.innerHTML = 'Posts';
  }

  async function unmount(el: Element, container: Container.API) {}
}
