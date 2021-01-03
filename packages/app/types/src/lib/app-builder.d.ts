import { Router } from '@crux/router';
import { Container } from '@crux/di';
import * as Layout from './layout/types';
import * as Modules from './modules/types';
import * as Mounter from './mounter/types';
import * as Views from './views/types';
import { Services as AppServices } from './types';
export declare function createAppBuilder<T>({ baseRoute, createMounter, createRouter, el, layout: createLayout, modules: modulesCollection, routes, services: servicesCollection, views: viewsCollection, }: {
    baseRoute: string;
    createMounter: Mounter.Constructor<T>;
    el: Element;
    layout: Layout.Constructor<T>;
    modules?: Modules.ConstructorCollection<T>;
    routes?: Router.RoutesConfig;
    createRouter: Router.Constructor;
    services?: Container.ConstructorCollection<T>;
    views: Views.ConstructorCollection<T>;
}): Promise<{
    app: Container.API<AppServices>;
    services: Container.API<T>;
}>;
