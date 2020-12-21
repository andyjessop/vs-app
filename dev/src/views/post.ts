import type { MountParams } from "../lib/app/app";

export function post() {
  return {
    mount, unmount,
  };

  async function mount({ currentRoute, el }: MountParams) {
    el.innerHTML = `Post: ${currentRoute.params.id}`;
  }

  async function unmount(el: Element, state: string) {}
}