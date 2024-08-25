import { useCallback, useContext, useEffect, useState } from 'react';
import { useMatchRoute } from './useMatchRoute';
import { useDocumentTitle } from '../document-title';
import { useNavigate } from 'react-router-dom';

export interface KeepAliveTab {
  title: string;
  routePath: string;
  key: string;
  pathname: string;
  icon?: any;
  children: any;
}

function getKey() {
  return new Date().getTime().toString();
}

export function useTabs(schema) {
  // 存放页面记录
  const [keepAliveTabs, setKeepAliveTabs] = useState<KeepAliveTab[]>([]);
  // 当前计划的tab
  const [activeTabRoutePath, setActiveTabRoutePath] = useState<string>('');
  const matchRoute = useMatchRoute(schema);

  const { title } = useDocumentTitle();
  useEffect(() => {
    // schema?.['x-component']==='Menu.Item'||schema?.['x-component']==='Menu.SubMenu'
    console.debug(schema);
    console.debug(matchRoute);

    if (!matchRoute) return;

    console.debug(keepAliveTabs);
    const existKeepAliveTab = keepAliveTabs.find((o) => o.routePath === matchRoute?.routePath);
    // 如果不存在且title不为空第一次初始化为空，则需要插入
    if (
      !existKeepAliveTab &&
      title != '' &&
      matchRoute?.routePath !== '/admin' &&
      schema?.['x-component'] !== 'Menu.SubMenu' &&
      schema?.['x-component'] !== 'Menu.URL'
    ) {
      console.debug(title);
      console.debug('增加标签');
      console.debug(matchRoute);
      setKeepAliveTabs((prev) => [
        ...prev,
        {
          title: title,
          key: getKey(),
          routePath: matchRoute.routePath,
          pathname: matchRoute.pathname,
          children: matchRoute.children,
          icon: matchRoute.icon,
        },
      ]);
    }
    setActiveTabRoutePath(matchRoute.routePath);
  }, [matchRoute, title, schema]);

  const navigate = useNavigate();

  // 关闭tab
  const closeTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      const index = keepAliveTabs.findIndex((o) => o.routePath === routePath);
      if (index > 0) {
        navigate(keepAliveTabs[index - 1].routePath);
      } else {
        navigate(keepAliveTabs[index + 1].routePath);
      }
      keepAliveTabs.splice(index, 1);
      setKeepAliveTabs([...keepAliveTabs]);
    },
    [activeTabRoutePath],
  );

  // 关闭除了自己的其他tab
  const closeOtherTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      setKeepAliveTabs((prev) => prev.filter((o) => o.routePath === routePath));
    },
    [activeTabRoutePath],
  );

  // 刷新tab
  const refreshTab = useCallback(
    (routePath: string = activeTabRoutePath) => {
      setKeepAliveTabs((prev) => {
        const index = prev.findIndex((tab) => tab.routePath === routePath);
        if (index > 0) {
          // 这个是react的特性，key变了，组件会卸载重新渲染
          prev[index].key = getKey();
        }
        return [...prev];
      });
    },
    [activeTabRoutePath],
  );

  return {
    tabs: keepAliveTabs,
    activeTabRoutePath,
    closeTab,
    closeOtherTab,
    refreshTab,
  };
}
