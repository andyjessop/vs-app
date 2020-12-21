import type { MountParams } from "../lib/app/app";

export function posts() {
  return {
    mount, unmount,
  };

  async function mount({ el }: MountParams) {
    el.innerHTML = `Posts`;
  }

  async function unmount(el: Element, state: string) {}
}