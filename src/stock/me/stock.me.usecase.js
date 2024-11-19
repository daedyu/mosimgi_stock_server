const { AppDataSource } = require('../../data-source');
const UserRepository = require("../../user/user.repository");

const stockMeRepository = new StockMeRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);
const {getEmail} = require("../../../config/jwt/jwt.config");

exports.setStockMe = async (user, stock, amount) => {
    try {
        await stockMeRepository.save(user, stock, amount);
    } catch (error) {
        console.log(error);
    }
}

exports.deleteStock = async (amount, user, stock) => {
    try {
        await stockMeRepository.deleteStock(user, stock, amount);
    } catch (e) {
        console.log(e);
    }
}

exports.getStockMe = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const email = await getEmail(token);
        const user = await userRepository.findByEmail(email);
        res.status(200).json(stockMeRepository.findByUserId(user.id))
    } catch (e) {
        res.status(500).json({message: e});
    }
}