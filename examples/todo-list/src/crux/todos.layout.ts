import { html, render } from 'lit-html';
import { Layout } from '@crux/app';
import { Services } from '..';

export function createLayout(el: Element): Layout.API<Services> {
  return {
    update,
  };

  function template() {
    return html`
      <section class="todoapp" data-view-id="todos"></section>
      <footer class="footer" data-view-id="footerNav"></footer>
      <footer class="info">
        <p>Double-click to edit a todo</p>
      </footer>
    `;
  }

  function update(): Promise<void> | void {
    render(template(), el);
  }
}
