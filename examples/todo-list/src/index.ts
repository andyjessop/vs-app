import { createApp, createStoreModule } from '@crux/app';
import { createTodosModule } from './crux/todos.module';
import { createLayout } from './crux/todos.layout';
import { createTodos, State, Todos } from './todos/todos.model';
import { createStore, Store } from '@crux/state';

export interface Services {
  store: Store<State>;
  todos: Todos;
}

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

createApp<Services>({
  baseRoute: '',
  el: appEl,
  layout: createLayout,
  modules: {
    store: createStoreModule,
    todos: createTodosModule,
  },
  routes: {
    active: '/active',
    completed: '/completed',
  },
  services: {
    store: createStore,
    todos: [createTodos, 'store'],
  },
  views: {
    footerNav: (app, services) =>
      import('./crux/footer-nav.view').then((mod) => mod.footerNav(app, services)),
    todos: (app, services) => import('./crux/todos.view').then((mod) => mod.todos(services)),
  },
}).then(({ app }) => app.get('dispatch')());
