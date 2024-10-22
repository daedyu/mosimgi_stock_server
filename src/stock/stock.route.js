const express = require('express');
const {getStocksByPriceRange, getStockByName, getAllStocks, saveStock, getMostTradeStocks} = require("./stock.service");
const router = express.Router();

router.get('/', getAllStocks);

router.get('/most-trade', getMostTradeStocks);

router.get('/:name', getStockByName);

router.get('/price/:min/:max', getStocksByPriceRange);

router.post('/', saveStock)

module.exports = router;
