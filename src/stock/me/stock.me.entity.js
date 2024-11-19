const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'StockMe',
    tableName: 'stock_me',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },

        stock_id: {
            type: 'int',
        },

        user_id: {
            type: 'int',
        },

        created_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        }
    },
    relations: {
        stock: {
            type: 'many-to-one',
            target: 'Stock',
            joinColumn: { name: 'stock_id', referencedColumnName: 'id' },
            cascade: true,
        },
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'user_id', referencedColumnName: 'id' },
            cascade: true,
        }
    }
})