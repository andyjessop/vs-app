import { Container } from '@crux/di';
import { Router } from '@crux/router';
import { AppServices } from '../types';

export interface Module {
  actions?: Record<string, Function>;
  destroy?: () => void;
}

export type Constructor<T> = (
  app: Container.API<AppServices>,
  services: Container.API<T>,
) => Module | Promise<Module>;

export type ConstructorObject<T> = {
  module: Constructor<T>;
  routes: (string | Router.RouteData)[];
};

export type ConstructorCollection<T> = Record<string, Constructor<T> | ConstructorObject<T>>;

export interface API<T> {
  add(name: string, constructor: Constructor<T> | ConstructorObject<T>): boolean | null;
  get(name: string): Module | undefined;
  getDynamic(name: string): Promise<Module> | undefined;
  remove(name: string): void;
  onRouteEnter(route: Router.RouteData): Promise<boolean>;
}
