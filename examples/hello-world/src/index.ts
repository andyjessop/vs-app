import { createApp } from '@crux/app';
import { createLayout } from './layout/layout';

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

createApp({
  baseRoute: '',
  el: appEl,
  layout: createLayout,
  routes: {},
  views: {
    hello: () => import('./views/hello-world').then((mod) => mod.helloWorld()),
  },
}).then((app) => {
  app.dispatch('root', 'init');

  (<any>window).app = app;
});
