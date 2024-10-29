const { AppDataSource } = require('../data-source');
const StockRepository = require("./stock.repository");
const {MustBeEntityError} = require("typeorm");
const {getEmail} = require("../../config/jwt/jwt.config");
const UserRepository = require("../user/user.repository");
const buyRepository = require("../trade/buy/buy.repository");
const FavoriteRepository = require("../favorite/favorite.repository");

const stockRepository = new StockRepository(AppDataSource);
const favoriteRepository = new FavoriteRepository(AppDataSource);
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

exports.getStockById = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const email = await getEmail(token);
        const user = await userRepository.findByEmail(email);
        const stock = await stockRepository.findById(req.params.name);
        const stock_price = await stockRepository.findByIdForTrades(req.params.name);
        const is_liked = await favoriteRepository.findIsLike(user.id, stock.id);
        if (!stock_price) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.json({
            stock_name: stock.name,
            is_liked: is_liked,
            graph: stock_price
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve stock', error });
    }
};