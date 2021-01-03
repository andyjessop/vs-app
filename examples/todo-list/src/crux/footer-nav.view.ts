import { AppServices } from '@crux/app/types/src/lib/types';
import { Container } from '@crux/di';
import { html, render, TemplateResult } from 'lit-html';
import { Services } from '..';
import { count } from '../todos/components/count';
import { State } from '../todos/todos.model';

export function footerNav(app: Container.API<AppServices>, container: Container.API<Services>) {
  const router = app.get('router');
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

  function link(text: string, route: string, selected: boolean): TemplateResult {
    return html`<a href @click="${(e: Event) => navigtateToRoute(e, route)}">${text}</a>`;
  }

  function getTodosCount(state: State) {
    return state.todos.length;
  }

  async function mount(root: Element) {
    el = root;

    return update(initialValue, router?.getCurrentRoute()?.name);
  }

  function navigtateToRoute(event: Event, route: string) {
    event.preventDefault();
    event.stopPropagation();

    router?.navigate(route);
  }

  function unmount(el: Element) {
    unsubscribe();
  }

  function update(todosCount: number, routeName?: string) {
    return render(
      html`
        ${count(todosCount)}
        <ul class="filters">
          <li>${link('All', 'root', routeName === 'root')}</li>
          <li>${link('Active', 'active', routeName === 'active')}</li>
          <li>${link('Completed', 'completed', routeName === 'completed')}</li>
        </ul>
        <!-- Hidden if no completed items are left ↓ -->
        <button class="clear-completed" @click=${todos?.removeCompleted}>Clear completed</button>
      `,
      el,
    );
  }
}
