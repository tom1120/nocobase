import React from 'react';

import {
  CardItem,
  Plugin,
  SchemaComponent,
  SchemaSettings,
  SchemaSettingsModalItem,
  useSchemaSettings,
} from '@nocobase/client';
import { ISchema } from '@formily/react';

const SchemaSettingsBlockTitleItem: any = () => {
  // 设计器的 Designable 实例
  const { dn } = useSchemaSettings();

  return (
    <SchemaSettingsModalItem
      title={'Edit block title'}
      schema={
        {
          type: 'object',
          title: 'Edit block title',
          properties: {
            title: {
              title: 'Block title',
              type: 'string',
              // 获取 schema 的默认值
              default: dn.getSchemaAttribute('x-decorator-props.title'),
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-compile-omitted': ['default'],
            },
          },
        } as ISchema
      }
      onSubmit={({ title }) => {
        // 参数覆盖
        dn.deepMerge({
          'x-decorator-props': {
            title,
          },
        });
      }}
    />
  );
};

const HomePage = () => {
  return (
    <SchemaComponent
      schema={{
        name: 'hello',
        type: 'void',
        'x-decorator': 'CardItem',
        'x-decorator-props': {
          title: '卡片',
          bordered: true,
        },
        'x-settings': 'mySettings',
        'x-component': 'h1',
        'x-content': 'Hello, World!',
      }}
    />
  );
};

export class PluginActionZyDemoClient extends Plugin {
  // You can get and modify the app instance here
  async load() {
    this.app.addComponents({
      HomePage,
      CardItem,
    });

    const mySettings = new SchemaSettings({
      name: 'mySettings',
      items: [
        {
          type: 'item',
          name: 'edit',
          useComponentProps() {
            // TODO: 补充相关设置逻辑
            return {
              title: 'Edit',
              onClick() {
                // todo
              },
            };
          },
        },
      ],
    });
    this.schemaSettingsManager.add(mySettings);

    this.schemaSettingsManager.addItem('mySettings', 'blockTitle', {
      Component: SchemaSettingsBlockTitleItem,
    });

    this.router.add('hello', {
      path: '/hello',
      Component: 'HomePage',
    });
  }
}

export default PluginActionZyDemoClient;
