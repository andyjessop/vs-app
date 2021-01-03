import { Container } from '@crux/di';
import { Layout } from '@crux/app';

export function createLayout(el: Element, container: Container.API): Layout.API {
  return {
    update,
  };

  function update(): Promise<void> | void {
    el.innerHTML = '<div data-view-id="hello"></div>';
  }
}
