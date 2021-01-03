import { Container } from '@crux/di';

export function helloWorld() {
  return {
    mount,
    unmount,
  };

  async function mount(el: Element, container: Container.API) {
    el.innerHTML = 'Hello World';
  }

  async function unmount(el: Element, container: Container.API) {}
}
