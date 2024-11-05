const { Server } = require('socket.io');

class SocketService {
    constructor(server) {
        if (SocketService.instance) {
            return SocketService.instance;
        }

        this.io = new Server(server, {
            cors: {
                origin: "*", // 실제 운영에서는 구체적인 도메인 지정 필요
                methods: ["GET", "POST"]
            },
            pingTimeout: 60000, // 60초
            pingInterval: 25000, // 25초
            connectTimeout: 10000, // 10초
        });

        this.connectionCount = 0; // 연결된 클라이언트 수 추적
        this.initialize();
        SocketService.instance = this;
    }

    initialize() {
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });

        // 주기적으로 연결 상태 모니터링
        setInterval(() => {
            this.monitorConnections();
        }, 300000); // 5분마다
    }

    handleConnection(socket) {
        this.connectionCount++;
        console.log(`Client connected (ID: ${socket.id}). Total connections: ${this.connectionCount}`);

        // 룸 참가 처리
        socket.on('join', (stockId) => {
            try {
                console.log("룸: ",stockId);
                this.handleJoinRoom(socket, stockId);
            } catch (error) {
                this.handleError(socket, 'join_error', error);
            }
        });

        // socket.emit('updatePrice', {test:"테스트데이터"})

        // 주식 데이터 요청 처리
        socket.on('requestStockData', (stockId) => {
            try {
                this.handleStockDataRequest(socket, stockId);
            } catch (error) {
                this.handleError(socket, 'request_error', error);
            }
        });

        // 연결 해제 처리
        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });

        // 에러 처리
        socket.on('error', (error) => {
            this.handleError(socket, 'socket_error', error);
        });
    }

    handleJoinRoom(socket, stockId) {
        if (!stockId) {
            throw new Error('Stock ID is required');
        }

        socket.join(stockId);
        console.log(`User ${socket.id} joined room: ${stockId}`);

        socket.emit('joinRoom', "asdasdadad:asdsadas");
    }

    handleStockDataRequest(socket, stockId) {
        // TODO: 실제 데이터베이스나 캐시에서 최신 주식 데이터를 조회
        const latestStockData = {
            stockId,
            timestamp: new Date().toISOString(),
            // ... 기타 필요한 데이터
        };

        socket.emit('stockData', latestStockData);
    }

    handleDisconnect(socket) {
        this.connectionCount--;
        console.log(`Client disconnected (ID: ${socket.id}). Total connections: ${this.connectionCount}`);
    }

    handleError(socket, errorType, error) {
        console.error(`Socket error (${errorType}):`, error);

        // 클라이언트에 에러 알림
        socket.emit('error_notification', {
            type: errorType,
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }

    updatePrice(stockId, tradeData) {
        if (!stockId || !tradeData) {
            console.error('Invalid updatePrice parameters:', { stockId, tradeData });
            return;
        }

        console.log(tradeData);

        try {
            this.io.to(stockId).emit('updatePrice', JSON.stringify(tradeData));
            console.log(`Price update sent to room ${stockId}`);
        } catch (error) {
            console.error(`Error broadcasting price update for stock ${stockId}:`, error);
        }
    }


    monitorConnections() {
        console.log(`Active connections: ${this.connectionCount}`);
    }


    static init(server) {
        if (!SocketService.instance) {
            return new SocketService(server);
        }
        return SocketService.instance;
    }
}

module.exports = SocketService;