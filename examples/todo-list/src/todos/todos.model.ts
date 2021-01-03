interface Todo {
  completed: boolean;
  text: string;
}

export interface State {
  todos: Todo[];
}

type Callback<T> = (state: T) => T;

export interface Store<T> {
  update(callback: Callback<T>): void;
}

export interface Todos {
  addTodo(text: string): void;
  removeCompleted(): void;
  removeTodo(index: number): void;
  toggleComplete(index: number): void;
}

export function createTodos(store: Store<State>): Todos {
  store.update(function add(state: State): State {
    state.todos = [
      { text: 'initial', completed: false },
      { text: 'second', completed: true },
    ];

    return state;
  });

  return {
    addTodo,
    removeCompleted,
    removeTodo,
    toggleComplete,
  };

  function addTodo(text: string): void {
    store.update(function add(state: State): State {
      state.todos = [
        ...state.todos,
        {
          completed: false,
          text,
        },
      ];

      return state;
    });
  }

  function removeCompleted(): void {
    store.update(function remove(state: State): State {
      state.todos = state.todos.filter((todo, index) => !todo.completed);

      return state;
    });
  }

  function removeTodo(index: number): void {
    store.update(function remove(state: State): State {
      state.todos = state.todos.filter((todo, ndx) => ndx !== index);

      return state;
    });
  }

  function toggleComplete(index: number): void {
    store.update(function toggle(state: State): State {
      state.todos = [...state.todos];

      state.todos[index].completed = !state.todos[index].completed;

      return state;
    });
  }
}
