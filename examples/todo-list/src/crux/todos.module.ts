import { App, Modules } from '@crux/app';
import { Container } from '@crux/di';
import { Services } from '..';

export function createTodosModule(
  app: Container.API<App.Services>,
  container: Container.API<Services>,
): Modules.Module {
  const todos = container.get('todos');
  const store = container.get('store');

  if (!todos || !store) {
    throw new Error('todoList or store service not provided');
  }
  return {
    actions: {
      addTodo: todos.addTodo,
      removeCompleted: todos.removeCompleted,
      removeTodo: todos.removeTodo,
      toggleComplete: todos.toggleComplete,
    },
  };
}
