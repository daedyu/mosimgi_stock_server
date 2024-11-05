const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Amount',
    tableName: 'amount',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },

        buyer_id: {
            type: 'int',
        },

        stock_id: {
            type: 'int',
        },

        amount: {
            type: 'int'
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
        buyer: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'buyer_id', referencedColumnName: 'id' },
            cascade: true,
        },
    },

});
