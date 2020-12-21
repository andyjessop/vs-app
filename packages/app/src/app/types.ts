import type { Router } from "../../../router/src/router/types";

export interface Context {
  modules: Modules;
  router: Router.API;
}

export interface Layout {
  update(context: Context): void;
}

export type Mounts = {
  mount: { el: Element, viewId: string }[],
  unmount: { el: Element, viewId: string }[],
}

export type Mount = (el: Element, context: Context) => void;

export type Mounted = Record<string, Element>;

export interface Module {
  actions: Record<string, Function>;
  init(context: Context): Promise<void> | void;
  initialState?: any;
}

export type Modules = Record<string, Module>;

export type Unmount = Mount;

export type View = (context: Context) => {
  mount: Mount,
  subscribe: [
    {
      events: string[],
      selector: Selector,
      handler: Handler;
    }
  ],
  unmount: Unmount,
};

export type Handler = (event: any, slice: any) => void;
export type Selector = (obj: any) => any;
export type Views = Record<string, View>;