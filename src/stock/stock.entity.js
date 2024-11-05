const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Stock',
    tableName: 'stock',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
            unique: true
        },
        description: {
            type: 'text',
        },
    },
    relations: {
        trades: {
            type: 'one-to-many',
            target: 'Trade',
            inverseSide: 'stock'
        },
        buys: {
            type: 'one-to-many',
            target: 'Buy',
            inverseSide: 'stock_id',
        }
    }
});
