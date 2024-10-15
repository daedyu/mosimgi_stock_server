const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Sell',
    tableName: 'sell_order',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        price: {
            type: 'int',
        },

        seller_id: {
            type: 'int',
        },

        stock_id: {
            type: 'int',
        },

        created_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
    },
    relations: {
        stock: {
            type: 'many-to-one',
            target: 'Stock',
            joinColumn: { name: 'stock_id', referencedColumnName: 'id' },
            cascade: true,
        },
        seller: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'seller_id', referencedColumnName: 'id' },
            cascade: true,
        },
    },
});
