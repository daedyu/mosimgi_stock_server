const express = require('express');
const {getMyTrade, buyStock, sellStock} = require("./trade.service");
const router = express.Router();

router.get('/', getMyTrade);

router.post('/buy', buyStock)

router.post('/sell', sellStock)

module.exports = router;