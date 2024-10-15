const express = require('express');
const {getMyTrade, buyStock} = require("./trade.service");
const router = express.Router();

router.get('/', getMyTrade);

router.post('/buy', buyStock)

module.exports = router;