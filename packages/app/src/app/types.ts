import type { Router } from '@crux/router';

export interface Context {
  modules: Modules; // eslint-disable-line no-use-before-define
  router: Router.API;
}

export interface Layout {
  update(context: Context): void;
}

export type Mounts = {
  mount: { el: Element; viewId: string }[]; // eslint-disable-line no-undef
  unmount: { el: Element; viewId: string }[]; // eslint-disable-line no-undef
};

export type Mount = (el: Element, context: Context) => void; // eslint-disable-line no-undef

export type Mounted = Record<string, Element>; // eslint-disable-line no-undef

export interface Module {
  actions: Record<string, Function>;
  init(context: Context): Promise<void> | void;
  initialState?: any;
}

export type Modules = Record<string, Module>;

export type Unmount = Mount;

export type Handler = (event: any, slice: any) => void;
export type Selector = (obj: any) => any;

export type View = (
  context: Context,
) => {
  mount: Mount;
  subscribe: [
    {
      events: string[];
      selector: Selector;
      handler: Handler;
    },
  ];
  unmount: Unmount;
};

export type Views = Record<string, View>;
