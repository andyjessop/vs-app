import { Layout } from '@crux/app';

export function createLayout(el: Element): Layout.API {
  return {
    update,
  };

  function update(): Promise<void> | void {
    el.innerHTML = '<div data-view-id="hello"></div>';
  }
}
