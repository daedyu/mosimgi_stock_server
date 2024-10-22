const { AppDataSource } = require('../data-source');
const StockRepository = require("./stock.repository");
const {MustBeEntityError} = require("typeorm");
const {getEmail} = require("../../config/jwt/jwt.config");
const UserRepository = require("../user/user.repository");
const buyRepository = require("../trade/buy/buy.repository");

const stockRepository = new StockRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);

exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await stockRepository.findAll();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve stocks', error });
    }
};

exports.getMostTradeStocks = async (req, res) => {
    try {
        const stocks = await stockRepository.findMostTrade();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve stocks', error });
    }
}

exports.saveStock = async (req, res) => {
    try {
        console.log(req.body);
        const stock = await stockRepository.save(req.body);
        res.json(stock);
    } catch (error) {
        if (error instanceof MustBeEntityError) {
            return res.status(400).send({message: "입력이 없습니다.", error});
        }
        res.status(400).json({ message: 'Failed to save stock', error });
    }
}

exports.getStockByName = async (req, res) => {
    try {
        const stock = await stockRepository.findByName(req.params.name);
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve stock', error });
    }
};

exports.getStocksByPriceRange = async (req, res) => {
    try {
        const min = parseFloat(req.params.min);
        const max = parseFloat(req.params.max);
        const stocks = await stockRepository.findByPriceRange(min, max);
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve stocks', error });
    }
};