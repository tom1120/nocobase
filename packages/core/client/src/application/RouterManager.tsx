import { set, get } from 'lodash';
import React, { ComponentType } from 'react';
import {
  BrowserRouter,
  BrowserRouterProps,
  HashRouter,
  HashRouterProps,
  MemoryRouter,
  MemoryRouterProps,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  useRoutes,
} from 'react-router-dom';
import { BlankComponent, RouterContextCleaner } from './components';
import { Application } from './Application';
// import type {Router} from "@remix-run/router";

export interface BrowserRouterOptions extends Omit<BrowserRouterProps, 'children'> {
  type?: 'browser';
}
export interface HashRouterOptions extends Omit<HashRouterProps, 'children'> {
  type?: 'hash';
}
export interface MemoryRouterOptions extends Omit<MemoryRouterProps, 'children'> {
  type?: 'memory';
}
export type RouterOptions = (HashRouterOptions | BrowserRouterOptions | MemoryRouterOptions) & {
  renderComponent?: RenderComponentType;
};
export type ComponentTypeAndString<T = any> = ComponentType<T> | string;
export interface RouteType extends Omit<RouteObject, 'children' | 'Component'> {
  Component?: ComponentTypeAndString;
}
export type RenderComponentType = (Component: ComponentTypeAndString, props?: any) => React.ReactNode;

export class RouterManagerV5 {
  protected routes: Record<string, RouteType> = {};
  protected options: RouterOptions;
  public app: Application;

  constructor(options: RouterOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  getRoutesTree(): RouteObject[] {
    type RouteTypeWithChildren = RouteType & { children?: RouteTypeWithChildren };
    const routes: Record<string, RouteTypeWithChildren> = {};

    /**
     * { 'a': { name: '1' }, 'a.b': { name: '2' }, 'a.c': { name: '3' } };
     * =>
     * { a: { name: '1', children: { b: { name: '2' }, c: {name: '3'} } } }
     */
    for (const [name, route] of Object.entries(this.routes)) {
      set(routes, name.split('.').join('.children.'), { ...get(routes, name.split('.').join('.children.')), ...route });
    }

    /**
     * get RouteObject tree
     *
     * @example
     * { a: { name: '1', children: { b: { name: '2' }, c: { children: { d: { name: '3' } } } } } }
     * =>
     * { name: '1', children: [{ name: '2' }, { name: '3' }] }
     */
    const buildRoutesTree = (routes: RouteTypeWithChildren): RouteObject[] => {
      return Object.values(routes).reduce<RouteObject[]>((acc, item) => {
        if (Object.keys(item).length === 1 && item.children) {
          acc.push(...buildRoutesTree(item.children));
        } else {
          const { Component, element, children, ...reset } = item;
          let ele = element;
          if (Component) {
            if (typeof Component === 'string') {
              ele = this.app.renderComponent(Component);
            } else {
              ele = React.createElement(Component);
            }
          }
          const res = {
            ...reset,
            element: ele,
            children: children ? buildRoutesTree(children) : undefined,
          } as RouteObject;
          console.debug(res);
          acc.push(res);
        }
        return acc;
      }, []);
    };

    return buildRoutesTree(routes);
  }

  getRoutes() {
    return this.routes;
  }

  setType(type: RouterOptions['type']) {
    this.options.type = type;
  }

  setBasename(basename: string) {
    this.options.basename = basename;
  }

  getRouterComponent() {
    const { type = 'browser', ...opts } = this.options;
    const Routers = {
      hash: HashRouter,
      browser: BrowserRouter,
      memory: MemoryRouter,
    };

    const ReactRouter = Routers[type];

    const RenderRoutes = () => {
      const routes = this.getRoutesTree();
      console.debug(routes);
      const element = useRoutes(routes);
      console.debug(element);
      return element;
    };

    const RenderRouter: React.FC<{ BaseLayout?: ComponentType }> = ({ BaseLayout = BlankComponent }) => {
      return (
        <RouterContextCleaner>
          <ReactRouter {...opts}>
            <BaseLayout>
              <RenderRoutes />
            </BaseLayout>
          </ReactRouter>
        </RouterContextCleaner>
      );
    };

    return RenderRouter;
  }

  add(name: string, route: RouteType) {
    this.routes[name] = route;
  }

  get(name: string) {
    return this.routes[name];
  }

  has(name: string) {
    return !!this.get(name);
  }

  remove(name: string) {
    delete this.routes[name];
  }
}

export function createRouterManagerV5(options?: RouterOptions, app?: Application) {
  return new RouterManagerV5(options, app);
}

export class RouterManager {
  protected routes: Record<string, RouteType> = {};
  protected options: RouterOptions;
  public app: Application;

  constructor(options: RouterOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  getRoutesTree(): RouteObject[] {
    type RouteTypeWithChildren = RouteType & { children?: RouteTypeWithChildren };
    const routes: Record<string, RouteTypeWithChildren> = {};

    /**
     * { 'a': { name: '1' }, 'a.b': { name: '2' }, 'a.c': { name: '3' } };
     * =>
     * { a: { name: '1', children: { b: { name: '2' }, c: {name: '3'} } } }
     */
    console.debug(this.routes);
    for (const [name, route] of Object.entries(this.routes)) {
      set(routes, name.split('.').join('.children.'), { ...get(routes, name.split('.').join('.children.')), ...route });
    }

    /**
     * get RouteObject tree
     *
     * @example
     * { a: { name: '1', children: { b: { name: '2' }, c: { children: { d: { name: '3' } } } } } }
     * =>
     * { name: '1', children: [{ name: '2' }, { name: '3' }] }
     */
    const buildRoutesTree = (routes: RouteTypeWithChildren): RouteObject[] => {
      return Object.values(routes).reduce<RouteObject[]>((acc, item) => {
        console.debug(item);
        if (Object.keys(item).length === 1 && item.children) {
          acc.push(...buildRoutesTree(item.children));
        } else {
          const { Component, element, children, ...reset } = item;
          let ele = element;
          if (Component) {
            if (typeof Component === 'string') {
              ele = this.app.renderComponent(Component, item);
            } else {
              ele = React.createElement(Component, item);
            }
          }
          const res = {
            ...reset,
            element: ele,
            children: children ? buildRoutesTree(children) : undefined,
            handle: {
              icon: '',
              title: '',
            },
          } as RouteObject;
          console.debug(res);
          acc.push(res);
        }
        return acc;
      }, []);
    };

    return buildRoutesTree(routes);
  }

  getRoutes() {
    return this.routes;
  }

  setType(type: RouterOptions['type']) {
    this.options.type = type;
  }

  setBasename(basename: string) {
    this.options.basename = basename;
  }

  getRouterComponent() {
    const { type = 'browser', ...opts } = this.options;

    const RenderRoutes = () => {
      const routes = this.getRoutesTree();
      return routes;
    };

    const Routers = {
      hash: createHashRouter,
      browser: createBrowserRouter,
      memory: createMemoryRouter,
    };
    // type Router = ReturnType<typeof createBrowserRouter>; or import type {Router} from "@remix-run/router";  但是数组返回类型是Router|Router
    const ReactRouter = Routers[type](RenderRoutes());
    console.debug(ReactRouter);
    const RenderRouter: React.FC<{ BaseLayout?: ComponentType }> = ({ BaseLayout = BlankComponent }) => {
      return (
        <BaseLayout>
          <RouterContextCleaner>
            <RouterProvider router={ReactRouter}></RouterProvider>
          </RouterContextCleaner>
        </BaseLayout>
      );
    };

    return RenderRouter;
  }

  add(name: string, route: RouteType) {
    this.routes[name] = route;
  }

  get(name: string) {
    return this.routes[name];
  }

  has(name: string) {
    return !!this.get(name);
  }

  remove(name: string) {
    delete this.routes[name];
  }
}

export function createRouterManager(options?: RouterOptions, app?: Application) {
  return new RouterManager(options, app);
}
