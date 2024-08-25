import { Plugin } from '@nocobase/server';
import path from 'path';

export class PluginActionZyDemoServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    await this.db.import({
      directory: path.resolve(__dirname, 'collections'),
    });
    // 这是一段示例，表示将hello表的所有操作对外公开
    this.app.acl.allow('hello', '*', 'public');
    this.app.acl.allow('products', '*');
    this.app.acl.allow('categories', '*');
    this.app.acl.allow('categories.products', '*');
    this.app.acl.allow('orders', '*');
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginActionZyDemoServer;
