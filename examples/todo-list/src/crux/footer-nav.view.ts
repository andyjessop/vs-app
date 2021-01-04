import { App } from '@crux/app';
import { Container } from '@crux/di';
import { html, render } from 'lit-html';
import { Services } from '..';
import { count } from '../todos/components/count';
import { State } from '../todos/todos.model';
import { LitHtml } from '@crux/lit-html';

export function footerNav(app: Container.API<App.Services>, container: Container.API<Services>) {
  const router = app.get('router');
  const link: LitHtml.Link = app.get('link')(html);
  const store = container.get('store');
  const todos = container.get('todos');
  let el: Element;

  if (!store || !router) {
    throw new Error('Store or router does not exist');
  }

  const { initialValue, unsubscribe } = store.subscribe(getTodosCount, update);

  return {
    mount,
    unmount,
  };

  function getTodosCount(state: State) {
    return state.todos.length;
  }

  async function mount(root: Element) {
    el = root;

    return update(initialValue, router?.getCurrentRoute()?.name);
  }

  function unmount(el: Element) {
    unsubscribe();
  }

  function update(todosCount: number, routeName?: string) {
    debugger;
    return render(
      html`
        ${count(todosCount)}
        <ul class="filters">
          <li>
            ${link({
              text: 'All',
              route: 'root',
              classname: routeName === 'root' ? 'selected' : '',
            })}
          </li>
          <li>
            ${link({
              text: 'Active',
              route: 'active',
              classname: routeName === 'active' ? 'selected' : '',
            })}
          </li>
          <li>
            ${link({
              text: 'Completed',
              route: 'completed',
              classname: routeName === 'completed' ? 'selected' : '',
            })}
          </li>
        </ul>

        <!-- Hidden if no completed items are left ↓ -->
        <button class="clear-completed" @click=${todos?.removeCompleted}>Clear completed</button>
      `,
      el,
    );
  }
}
