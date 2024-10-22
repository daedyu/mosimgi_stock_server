const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Favorite',
    tableName: 'favorite',
    columns: {
        user_id: {
            type: 'bigint',
            primary: true,
        },
        stock_id: {
            type: 'int',
            primary: true,
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'user_id', referencedColumnName: 'id' },
            onDelete: 'CASCADE',
        },
        stock: {
            type: 'many-to-one',
            target: 'Stock',
            joinColumn: { name: 'stock_id', referencedColumnName: 'id' },
            onDelete: 'CASCADE',
        },
    },
});
