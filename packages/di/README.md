# Crux Dependency Injection

`@crux/di` is:

- very a very simple dependency injection container for decoupled applications,
- tiny, weighing in at around 1K minfied (< 400B gzipped),
- immutable, ensuring predictable state updates throughout your app.

## Installation

```bash
npm install @crux/state --save
```

## Usage

```ts
import { createStore } from '@crux/state';

/**
 * Create the initial state.
 */
const initial = {
  users: {
    active: [1, 2, 3],
  },
};

/**
 * Create your store from the initial state.
 */
const store = createStore(initial);

/**
 * Create a selector for your callback.
 **/
const getActiveUsers = (state) => state.users;

/**
 * Create an observer for the store.
 */
const users = store.subscribe(getActiveUsers, log);

/**
 * Update the state, and watch it log to the console.
 */
store.update(state => {
  state.users.active = [...state.users.active, 4];

  return state;
});

/**
 * Log the change event to the console.
 */
function log(key, value) {
  console.log(key, value);
}
```

### A Note on Immutability

Notice in the example above that the `users.active` array is updated immutably, by creating a new array reference with the spread operator. This is essential for `@crux/state` to know that the contents of the object have changed.
