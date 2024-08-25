/*
 * @Author: zhaoyi tom1120@126.com
 * @Date: 2024-03-23 09:49:31
 * @LastEditors: zhaoyi tom1120@126.com
 * @LastEditTime: 2024-03-27 09:21:04
 * @FilePath: \nocobase\packages\core\client\src\route-switch\antd\admin-layout\tabs-layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Dropdown, Tabs } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { useMatchRoute } from '../../../hooks/useMatchRoute';
import antdIcon from '../../../icon/demos/antd-icon';
// import { useDocumentTitle } from "../../../document-title";
import { KeepAliveTab, useTabs } from '../../../hooks/useTabs';
import { useNavigate } from 'react-router-dom';

import type { MenuItemType } from 'antd/es/menu/hooks/useItems';

enum OperationType {
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHER = 'close-other',
}

const TabsLayout: React.FC<any> = (props) => {
  // return (
  //     <Tabs
  //       defaultActiveKey='test'
  //       items={[{
  //         label: '测试',
  //         key: 'test',
  //         children: (
  //           <div className='px-[16px]'>
  //             <Outlet />
  //           </div>
  //         )
  //       }]}
  //       type='card'
  //     />
  //   )

  console.debug(props);

  // const {title} = useDocumentTitle();
  // console.debug(title);

  const getIcon = (icon?: string): React.ReactElement | undefined => {
    return icon && antdIcon[icon] && React.createElement(antdIcon[icon]);
  };

  const { activeTabRoutePath, tabs, closeTab, closeOtherTab, refreshTab } = useTabs(props.current);

  const menuItems: MenuItemType[] = useMemo(
    () =>
      [
        {
          label: '刷新',
          key: OperationType.REFRESH,
        },
        tabs.length <= 1
          ? null
          : {
              label: '关闭',
              key: OperationType.CLOSE,
            },
        tabs.length <= 1
          ? null
          : {
              label: '关闭其他',
              key: OperationType.CLOSEOTHER,
            },
      ].filter((o) => o !== null) as MenuItemType[],
    [tabs],
  );

  const menuClick = useCallback(
    ({ key, domEvent }: any, tab: KeepAliveTab) => {
      domEvent.stopPropagation();

      if (key === OperationType.REFRESH) {
        refreshTab(tab.routePath);
      } else if (key === OperationType.CLOSE) {
        closeTab(tab.routePath);
      } else if (key === OperationType.CLOSEOTHER) {
        closeOtherTab(tab.routePath);
      }
    },
    [closeOtherTab, closeTab, refreshTab],
  );

  const renderTabTitle = useCallback(
    (tab: KeepAliveTab) => {
      return (
        <Dropdown menu={{ items: menuItems, onClick: (e) => menuClick(e, tab) }} trigger={['contextMenu']}>
          <div style={{ margin: '-12px 0', padding: '12px 0' }}>
            {getIcon(tab.icon)}
            {tab.title}
          </div>
        </Dropdown>
      );
    },
    [menuItems],
  );

  const tabItems = useMemo(() => {
    return tabs.map((tab) => ({
      label: renderTabTitle(tab),
      key: tab.routePath,
      children: (
        <div key={tab.key} className="px-[16px]" style={{ position: 'relative', top: 'var(--nb-header-height)' }}>
          {tab.children}
        </div>
      ),
      closable: tabs.length > 1, // 剩最后一个就不能删除了
    }));
  }, [tabs]);

  const navigate = useNavigate();
  const onTabsChange = useCallback((tabRoutePath: string) => {
    navigate(tabRoutePath);
  }, []);

  const onTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      closeTab(targetKey as string);
    }
  };

  return (
    <Tabs
      tabBarStyle={{
        position: 'fixed',
        // height: '',
        width: '100%',
        top: 'var(--nb-header-height)',
        zIndex: 1000,
      }}
      activeKey={activeTabRoutePath}
      items={tabItems}
      type="editable-card"
      onChange={onTabsChange}
      hideAdd
      onEdit={onTabEdit}
    />
  );

  // const matchRoute = useMatchRoute();
  // console.debug({matchRoute});

  // return (
  //     <Tabs
  //       defaultActiveKey='test'
  //       items={matchRoute ? [{
  //         label: (
  //           <>
  //             {getIcon(matchRoute.icon)}
  //             {title}
  //           </>
  //         ),
  //         key: matchRoute.routePath,
  //         children: (
  //           <div className='px-[16px]'>
  //             {matchRoute.children}
  //           </div>
  //         )
  //       }] : []}
  //       type='card'
  //     />
  //   )
};

export default TabsLayout;
