const { Server } = require('socket.io');

class SocketService {
    constructor(server) {
        this.io = new Server(server);
        this.initialize();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('A user connected');

            // 소켓 이벤트 핸들러 추가
            socket.on('requestStockData', () => {
                const latestStockData = {}; // 실제 데이터로 대체
                socket.emit('stockData', latestStockData);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

    emit(event, data) {
        this.io.emit(event, data);
    }
}

module.exports = SocketService;