import { Router } from '@crux/router';
import { Container } from '@crux/di';
import * as Layout from './layout/types';
import * as Modules from './modules/types';
import * as Views from './views/types';
export declare function createApp({ baseRoute, el, layout, modules: modulesCollection, routes, services: servicesCollection, views: viewsCollection, }: {
    baseRoute: string;
    el: Element;
    layout: Layout.Constructor;
    modules: Modules.ConstructorCollection;
    routes: Router.RoutesConfig;
    services?: Container.ConstructorCollection;
    views: Views.ConstructorCollection;
}): Promise<{
    dispatch: (moduleName?: string | undefined, action?: string | undefined, data?: any) => void;
    router: Router.API;
}>;
