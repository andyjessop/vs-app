import { html } from 'lit-html';

export function count(num: number) {
  return html`<span class="todo-count">
    <strong>${num}</strong> item${num === 1 ? '' : 's'} left
  </span>`;
}
