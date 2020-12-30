import type { EventEmitter } from '@crux/utils';
export declare namespace Router {
    type RouteParams = Record<string, string | null | string[]>;
    interface Route {
        decodeURL(url: string): null | RouteParams;
        encodeURL(dict: RouteParams): string;
        name: string;
    }
    interface API extends EventEmitter.API {
        back(): void;
        destroy(): void;
        forward(): void;
        getCurrentRoute(): Router.RouteData | null;
        go(num: number): void;
        navigate(name: string, params?: RouteParams): void;
        register(name: string, path: string): true | null;
        replace(name: string, params?: RouteParams): void;
    }
    interface CurrentRoute {
        params: any;
        route: Route;
    }
    enum Events {
        Transition = "transition"
    }
    interface RouteData {
        name: string;
        params: any;
    }
    type Routes = Record<string, Route>;
    type RoutesConfig = Record<string, string>;
    type Constructor = (baseRoute: string, config: RoutesConfig) => API;
}
