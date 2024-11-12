const express = require('express');
const {getStockById, getAllStocks, saveStock, getMostTradeStocks, getMyFavorite, getPopular} = require("./stock.service");
const router = express.Router();

router.get('/', getAllStocks);

router.get("/like", getMyFavorite);

router.get('/most-trade', getMostTradeStocks);

router.get('/popular', getPopular);

router.get('/:name', getStockById);

router.post('/', saveStock)

module.exports = router;
