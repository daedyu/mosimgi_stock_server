const { DataSource } = require('typeorm');
const {join} = require("node:path");

const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3305,
    username: 'root',
    password: 'mingyu08',
    database: 'mosimgi',
    synchronize: true,
    logging: true,
    entities: [
        join(__dirname, '/stock/stock.entity.js'),
        join(__dirname, '/trade/trade.entity.js'),
        join(__dirname, '/user/user.entity.js'),
        join(__dirname, '/trade/buy/buy.entity.js'),
        join(__dirname, '/trade/sell/sell.entity.js'),
    ],
});

module.exports = { AppDataSource };