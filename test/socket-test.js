const io = require('socket.io-client');
const socket = io('ws://localhost:3000');

// 서버와 연결되면 바로 buyStock 이벤트 전송
socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('join', 1);

});

// 거래 결과 수신
socket.on('updatePrice', (data) => {
    console.log('서버로부터 수신한 거래 데이터:', data);
});

// 주식 가격 업데이트 수신
socket.on('stockPricesUpdate', (stockPrices) => {
    console.log('Updated stock prices:', stockPrices);
    // 여기서 주식 가격을 UI에 표시할 수 있음
});

// 연결 오류 처리
socket.on('connect_error', (err) => {
    console.log('Connection error:', err);
});
