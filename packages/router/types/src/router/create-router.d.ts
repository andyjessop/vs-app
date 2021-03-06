import { Router } from './types';
import { EventEmitter } from '@crux/utils';
/**
 * Create a router.
 */
export declare function createRouter(base: string, initialRoutes: Router.RoutesConfig, emitter?: EventEmitter.API): Router.API;
