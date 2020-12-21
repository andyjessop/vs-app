import { createApp } from "./lib/app/app";
import { createRootModule } from "./modules/root/root.module";
import { createLayout } from "./layout/layout";
import { createRouter } from "./lib/router/router/create-router";

const appEl = document.getElementById('app');

if (!appEl) {
  throw Error('No app element found');
}

const router = createRouter('', {
  post: '/posts/:id',
  posts: '/posts'
});

const app = createApp({
  el: appEl,
  layout: createLayout,
  modules: { root: createRootModule() },
  router,
  views: {
    post: () => import('./views/post').then(mod => mod.post()),
    posts: () => import('./views/posts').then(mod => mod.posts())
  },
});

app.dispatch('root', 'init');

(<any>window).app = app;