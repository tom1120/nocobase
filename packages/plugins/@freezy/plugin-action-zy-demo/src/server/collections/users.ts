import { extend } from '@nocobase/database';

export default extend({
  name: 'users',
  fields: [
    {
      type: 'hasMany',
      name: 'orders',
    },
  ],
});
