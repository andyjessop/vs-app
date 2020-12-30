import { Container } from '@crux/di';
import { Router } from '@crux/router';

export interface Module {
  actions: Record<string, Function>;
  destroy?: () => void;
}

export type Constructor = (container: Container.API) => Module | Promise<Module>;

export type ConstructorObject = {
  module: Constructor;
  routes: (string | Router.RouteData)[];
};

export type ConstructorCollection = Record<string, Constructor | ConstructorObject>;

export interface API {
  add(name: string, constructor: Constructor | ConstructorObject): boolean | null;
  get(name: string): Module | undefined;
  getDynamic(name: string): Promise<Module> | undefined;
  remove(name: string): void;
  onRouteEnter(route: Router.RouteData): Promise<boolean>;
}
