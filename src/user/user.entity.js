const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: "User",
    tableName: "user",
    columns: {
        id: {
            type: "bigint",
            primary: true,
            generated: true,
        },
        email: {
            type: "varchar",
            unique: true,
            notNull: true,
        },
        nickname: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
        },
        role: {
            type: "varchar"
        },
        profile_image: {
            type: "varchar",
        },
        money: {
            type: "bigint"
        }
    },
    relations: {
        tradesAsBuyer: {
            type: 'one-to-many',
            target: 'Trade',
            inverseSide: 'buyer_id',
        },
        tradesAsSeller: {
            type: 'one-to-many',
            target: 'Trade',
            inverseSide: 'seller_id',
        },
        OrderAsSell: {
            type: 'one-to-many',
            target: 'Sell',
            inverseSide: 'seller_id',
        },
        OrderAsBuy: {
            type: 'one-to-many',
            target: 'Buy',
            inverseSide: 'buyer_id',
        }
    },
})