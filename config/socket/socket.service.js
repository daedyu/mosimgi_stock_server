const { Server } = require('socket.io');

class SocketService {
    constructor(server) {
        this.io = new Server(server);
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('A user connected');

            socket.on('join', (stockId) => {
                socket.join(stockId);
                console.log(`User ${socket.id} joined room: ${stockId}`);
            });

            socket.on('requestStockData', () => {
                const latestStockData = {};
                socket.emit('stockData', latestStockData);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

    updatePrice(stockId, tradeData) {
        this.io.to(stockId).emit('updatePrice', {tradeData});
    }

    emit(event, data) {
        this.io.emit(event, data);
    }
}

module.exports = SocketService;