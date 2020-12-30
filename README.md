<img src="./logo.png" /></div>

# Crux

The framework for long-lived code in browser-based TypeScript/Javascript apps.

The core concept of `crux` is that you shouldn't be locked-into a single framework that defines the structure of your code and makes it difficult to change. Instead, the majority of your code should be framework-agnostic, written in the language of your domain, and should be able to simply plug-in to a minimal core. `crux` is that core.

`crux` supports "micro-frontends", enabling large codebases to be split into smaller, more manageable, components. Small teams can work independently, allowing them to add code and deploy independently, focussing only on the parts of the site that are relevant to them.

`crux` enables you to transition to a separate framework without doing a complete re-write of the code. Apps written in a single framework, and built around that framework, are essentially technical debt because the amount of work required to move off that framework at some point grows with every line of code added. `crux` encourages you to write code that doesn't rely on a framework and so can be more easily transitioned as your business requirements change.

In summary, `crux`:

- is a Typescript/Javascript web-app framework for the browser,
- promotes highly-decoupled and long-lived code,
- does not tie your code to a single view library,
- provides simple integration for micro-frontends,
- lowers your level of technical debt,
- is fully-featured but is tiny (< 7KB all-in)

## Usage

```ts
import { createApp, createStoreModule } from '@crux/app';
import { createStore } from '@crux/state';
import { layout } from 'my-app/layout';
import { post } from 'my-app/views';
import { user } from 'my-app/modules';

const app = createApp({
  // App root element
  el: document.getElementById('app'),

  /*
  * The layout defines root elements for views, to which crux attaches and
  * instantiates views as necessary.
  *
  * The layout is free to use any view library.
  */
  layout,

  /**
   * Modules define the business logic of the app. They can define
   * events that are called by "dispatch" and can emit events of their
   * own for views to consume.
   */
  modules:  {
    /**
     * Modules can be imported dynamically and lazily instantiated to save time
     * on page load.
     */
    posts: (container) => import('my-app/modules/posts').then(mod => mod.posts(container)),

    /**
     * Modules can be loaded only for a specific route or routes. They will be instantiated when
     * entering that URL, and destroyed when leaving it.
     */
    user: {
      module: (container) => import('my-app/modules/users').then(mod => mod.users(container)),
      routes: [
        // routes can be specified by name...
        'users',

        // ...or with specific route parameters as defined in the routes section below
        { name: 'users', params: { id: 3 } }
      ]
    },

    /**
     * A core "store" module is provided to hook up the crux state service to the app.
     * Add it in here to enable its use.
     */
    store: createStoreModule,
  },

  /**
   * A small and lightweight router is provided.
   */
  routes: {
    post: '/posts/:id',
    posts: 'posts'
  },

  /**
   * Define your app-wide services here, they will be injected into the layout, modules, and views.
   * Services can be imported dynamically, and will be lazily instantiated.
   **/
  services: {
    http: () => import('my-app/services/http').then(mod => mod.default),
    cache: createLocalStorageService
    store: createStore,
  },

  /*
   * Views can be written independently in any framework, and are instantiated
   * individually on an element root provided by the layout. They can subscribe
   * to events emanating from the modules
   */
  views: {
    post: (container) => { mount, unmount, subscribe },

    /**
     * Views can also be imported dynamically (recommended).
     */
    posts: (container) => import('my-app/views/posts').then(mod => mod.posts(container)),
  },
});
```

## Dependency Injection

A dependency injection (DI) container is provided to decouple your modules and views from your services. The container is injected into the modules and views during instantiation, so that they have free access to those services at any time:

```ts
// inside a module
function createMyModule(container: Container.API) {
  return {
    actions: {
      doSomething: (withSomeData) => {
        const http = container.get<HTTP>('http'); // Type hint to get type inference
        const cache = container.get<Cache>('cache');

        http?.post('/some-url', withSomeData)
          .then(res => cache.set(res));
      }
    }
  }
}
```

Both the `router` and the `hooks` API (more on that later) are available in the DI container.

## Layout

`layout` is a simple function that returns an object with an `update` method. When `update` is called, the template updates and renders the layout into the DOM.

It is the job of the layout to provide root elements for the views, and it does this by attaching `data-view-id` attributes to those roots. In this way, it is completely decoupled from the views, and can therefore be written in a separate framework or none at all.

This example of the `layout` uses `lit-html`:

```ts
import { html, render } from 'lit-html';

export function layout(el, container) {
  return {
    update,
  };

  function template(route) {
    switch (route?.name) {
      case 'post':
        return html`<div data-view-id="post"></div>`;
      case 'posts':
        return html`<div data-view-id="posts"></div>`;
      default:
        return html`<div>Home</div>`;
    }
  }

  function update({ modules, router }) {
    const currentRoute = router.getCurrentRoute();

    render(template(currentRoute), root);
  }
}
```

## Views

In the example above, the `layout` provides root elements for `post` and `posts`. These are the "views" that we defined earlier. After the template is rendered, `crux` will first `unmount` any views that no longer exist, and `mount` any new views defined by the `layout`. The views, therefore, hook into these lifecyle events by providing `mount` and `unmount` functions to enable the view to initialise and destroy itself:

```ts
import type { Router } from '@crux/router';

/**
 * The view accepts the `context` as a parameter when instantiated, and also on both
 * mount and unmount.
 **/
export function post(container: Container.API) {
  const router = container.get<Router>('router');

  return {
    mount, unmount,
  };

  function mount(el) {
    const postId = router?.getCurrentRoute()?.params.id;

    el.innerHTML = `postId: ${postId}`;
  }

  function unmount(el) {
    el.innerHTML = '';
  }
}
```

`mount` and `unmount` can also be asynchronous. If asynchronous setup work needs to be done in the views, `crux` will queue any further events until the `Promise` has returned.

## Modules

Modules provide business logic to the app, reacting to UI events, updating state, and interfacing with external services. Modules can define `actions` to respond to specific UI events fired with `dispatch`:

```ts
// In myModule
export function myModule() {
  return {
    actions: {
      logData: (data) =>  { console.log(data) }
    }
  };
}

// then somewhere in the app
dispatch('myModule', 'logData', data);
```

Modules can provide a `destroy` method, in case they want to do any cleanup like, for example, in the core `store` module:

```ts
...
  hooks.addListener('beforeModule', pauseUpdates);
  hooks.addListener('afterMounter', resumeUpdates);

  return {
    destroy,
  };

  function destroy() {
    hooks?.removeListener('beforeModule', pauseUpdates);
    hooks?.removeListener('afterMounter', resumeUpdates);
  }
```

Modules have access to the container, to interface with external services:

```ts
export function logger(container: Container.API) {
  const http = container.get<HTTP>('http');

  return {
    actions: {
      logData: (data) =>  {
        http?.post('/log-endpoint', data);
      }
    }
  };
}
```

## State

There is no "built-in" state management library, so you are free to use any you like, but we've provided a tiny store module that chimes well with the core concepts of crux of being small, simple, and de-coupled. To use it, provide `createStore` as a service and `createStoreModule` as a module:

```ts
import { createStore } from '@crux/state';
import { createStoreModule } from '@crux/app';

createApp({
  ...

  modules: {
    ...

    store: createStoreModule,
  },

  ...

  services: {
    ...

    store: createStore,
  }
})
```

For a detailed view of the API, see the `@crux/state` documentation.

Let's create a module here, that will update the state, and a view that will observe it and update itself.

### The Module

```ts
export function users(container: Container.API) {
  const http = container.get<HTTP>('http');
  const store = container.get<State<MyStateInterface>>('store');

  return {
    actions: {
      fetchUsers: () =>  {
        http?.get('/users').then(updateStore);
      }
    }
  };

  function updateStore(users) {
    store.update((state) => {
      // users is updated immutably in order to be able to observe it in the view
      state.users = users;

      return state;
    });
  }
}
```

### The View

```ts
/**
 * The users view sets up a subscriber to the store using a state selector,
 * and updates the innerHTML whenever the subscription updates.
 **/
export function users(container: Container.API) {
  const store = container.get<State<MyStateInterface>>('store');
  let unsubscribe;

  return {
    mount, unmount,
  };

  function getUsers(state) {
    return state.users;
  }

  function mount(el) {
    const {
      initialValue,
      unsubscribe: unsub,
    } = store.subscribe(getUsers, update);

    unsubsribe = unsub;

    update(initialValue);
  }

  function unmount(el) {
    unsubscribe();
  }

  function update(users) {
    el.innerHTML = JSON.stringify(users);
  }
}
```
