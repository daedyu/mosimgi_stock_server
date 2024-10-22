const express = require('express');
const { AppDataSource } = require('./src/data-source');
const stockRoutes = require('./src/stock/stock.route');
const tradeRoutes = require('./src/trade/trade.route');
const favoriteRoutes = require('./src/favorite/favorite.route');
const { Server } = require('socket.io');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



AppDataSource.initialize().then(() => {
    console.log('Connected to MySQL');

    app.use('/favorites', favoriteRoutes);

    app.use('/stocks', stockRoutes);

    app.use('/trades', tradeRoutes);

    app.listen(3000, () => {
        console.log('Server started on http://localhost:3000');
    });
}).catch(error => console.log(error));