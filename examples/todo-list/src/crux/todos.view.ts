import { Container } from '@crux/di';
import { html, render } from 'lit-html';
import { Services } from '..';
import { header } from '../todos/components/header';
import { main } from '../todos/components/main';
import { State } from '../todos/todos.model';

export function todos(services: Container.API<Services>) {
  const store = services.get('store');
  let el: Element;

  if (!store) {
    throw new Error('Store does not exist');
  }

  const { initialValue, unsubscribe } = store.subscribe(getTodos, update);

  return {
    mount,
    unmount,
  };

  function getTodos(state: State) {
    return state.todos;
  }

  async function mount(root: Element) {
    el = root;
    return update(initialValue);
  }

  function unmount() {
    unsubscribe();
  }

  function update(todos: State['todos']) {
    render(html`${header()} ${todos?.length ? main(todos) : ''}`, el);
  }
}
