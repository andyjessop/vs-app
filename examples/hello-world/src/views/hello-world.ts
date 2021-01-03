export function helloWorld() {
  return {
    mount,
    unmount,
  };

  async function mount(el: Element) {
    el.innerHTML = 'Hello World';
  }

  async function unmount(el: Element) {}
}
