import { Container } from '@crux/di';
import { Router } from '@crux/router';
import { Layout, Modules, Mounter, Views } from '..';
export interface AppParams {
    baseRoute: string;
    el: Element;
    layout: Layout.Constructor;
    modules: Modules.ConstructorCollection;
    routes: Router.RoutesConfig;
    services?: Container.ConstructorCollection;
    views: Views.ConstructorCollection;
}
export interface AppBuilderParams extends AppParams {
    createMounter: Mounter.Constructor;
    createRouter: Router.Constructor;
}
