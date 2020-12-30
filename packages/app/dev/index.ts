import { createApp } from '../src/lib/app';
import { createRootModule } from './modules/root/root.module';
import { createLayout } from './layout/layout';

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

createApp({
  baseRoute: '',
  el: appEl,
  layout: createLayout,
  modules: { root: createRootModule },
  routes: {
    post: '/posts/:id',
    posts: '/posts',
  },
  views: {
    post: () => import('./views/post').then((mod) => mod.post()),
    posts: () => import('./views/posts').then((mod) => mod.posts()),
  },
}).then((app) => {
  app.dispatch('root', 'init');

  (<any>window).app = app;
});
