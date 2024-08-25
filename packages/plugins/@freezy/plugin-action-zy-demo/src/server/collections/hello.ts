import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'hello',
  fields: [
    { type: 'string', name: 'name' },
    { type: 'snowflake', name: 'id', primaryKey: true },
  ],
});
