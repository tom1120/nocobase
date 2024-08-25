export default {
  name: 'orders',
  fields: [
    {
      type: 'uuid',
      name: 'id',
      primaryKey: true,
    },
    {
      type: 'integer',
      name: 'quantity',
    },
    {
      type: 'integer',
      name: 'status',
    },
    {
      type: 'integer',
      name: 'totalPrice',
    },
    {
      type: 'belongsTo',
      name: 'product',
    },
    {
      type: 'string',
      name: 'address',
    },
    {
      type: 'belongsTo',
      name: 'user',
    },
  ],
};
