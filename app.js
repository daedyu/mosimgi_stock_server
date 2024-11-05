const express = require('express');
const { AppDataSource } = require('./src/data-source');
const stockRoutes = require('./src/stock/stock.route');
const tradeRoutes = require('./src/trade/trade.route');
const favoriteRoutes = require('./src/favorite/favorite.route');
const http = require('http');
const SocketService = require("./config/socket/socket.service");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const socketService = SocketService.init(server);

AppDataSource.initialize().then(() => {
    console.log('Connected to MySQL');

    app.use('/favorites', favoriteRoutes);

    app.use('/stocks', stockRoutes);

    app.use('/trades', tradeRoutes);

    server.listen(3000, () => {
        console.log('Server started on http://localhost:3000');
    });
}).catch(error => console.log(error));