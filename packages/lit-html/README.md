# Crux `lit-html` Integration

`@crux/lit-html` provides a `link` function as an app service, so that `lit-html` components can easily hook into the router:

## Installation

```bash
npm install @crux/crux-lit-html
```

Add the module:

```ts
import { litHtmlModule } from `@crux-lit-html`;

createApp({
  ...
  modules: {
    ...
    litHtmlModule,
  },
  ...
})
```

## Usage

```ts
export function myLinkedView(app: Container.API<App.Services>) {
  const link = app.get('link');
  const router = app.get('router');

  return {
    mount,
  };

  async function mount(root: Element) {
    const currentRoute = router.getCurrentRoute();

    return link({
      classname: currentRoute === 'users' ? 'active' : ''
      params: { id: 1 },
      route: 'users,
      text: 'Users',
    });
  }
}
```
