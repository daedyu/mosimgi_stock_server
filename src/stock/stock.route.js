const express = require('express');
const {getStockById, getAllStocks, saveStock, getMostTradeStocks} = require("./stock.service");
const router = express.Router();

router.get('/', getAllStocks);

router.get('/most-trade', getMostTradeStocks);

router.get('/:name', getStockById);

router.post('/', saveStock)

module.exports = router;
