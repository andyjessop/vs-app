import { Router } from '@crux/router';
import { Container } from '@crux/di';
import { Layout } from './types';
import * as Modules from './modules/types';
import * as Mounter from './mounter/types';
import * as Views from './views/types';
export declare function createApp({ baseRoute, createMounter, createRouter, layout, modules: modulesCollection, routes, services: servicesCollection, views: viewsCollection, }: {
    baseRoute: string;
    createMounter: Mounter.Constructor;
    layout: Layout;
    modules: Modules.ConstructorCollection;
    routes: Router.RoutesConfig;
    createRouter: Router.Constructor;
    services: Container.ConstructorCollection;
    views: Views.ConstructorCollection;
}): Promise<{
    dispatch: (moduleName?: string | undefined, action?: string | undefined, data?: any) => void;
    router: Router.API;
}>;
