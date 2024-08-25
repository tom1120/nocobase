/*
 * @Author: zhaoyi tom1120@126.com
 * @Date: 2024-03-23 09:54:03
 * @LastEditors: zhaoyi tom1120@126.com
 * @LastEditTime: 2024-03-25 14:47:18
 * @FilePath: \nocobase\packages\core\client\src\hooks\useMatchRoute.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import { useLocation, useMatches, useOutlet } from 'react-router-dom';

interface MatchRouteType {
  // 菜单名称
  title: string;
  // tab对应的url
  pathname: string;
  // 要渲染的组件
  children: any;
  // 路由，和pathname区别是，详情页 pathname是 /:id，routePath是 /1
  routePath: string;
  // 图标
  icon?: string;
}

export function useMatchRoute(schema): MatchRouteType | undefined {
  // 获取路由组件实例
  const children = useOutlet();
  // 获取所有路由
  const matches = useMatches();
  console.debug(matches);
  // 获取当前url
  const { pathname } = useLocation();

  const [matchRoute, setMatchRoute] = useState<MatchRouteType | undefined>();

  // 监听pathname变了，说明路由有变化，重新匹配，返回新路由信息
  useEffect(() => {
    let tempRoute = matches.at(-1);
    // 获取当前匹配的路由
    if (schema?.['x-component'] === 'Menu.SubMenu' || schema?.['x-component'] === 'Menu.URL') {
      tempRoute = matches.at(-2);
    }
    const lastRoute = tempRoute;
    console.debug(lastRoute);

    // if (!lastRoute?.handle) return;

    setMatchRoute({
      title: (lastRoute?.handle as any)?.name,
      pathname,
      children,
      routePath: lastRoute?.pathname || '',
      icon: (lastRoute?.handle as any)?.icon,
    });
  }, [pathname, schema]);

  return matchRoute;
}
