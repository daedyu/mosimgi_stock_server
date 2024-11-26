const { AppDataSource } = require('../../data-source');
const UserRepository = require("../../user/user.repository");
const  StockMeRepository  = require("./stock.me.repository");

const stockMeRepository = new StockMeRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);
const {getEmail} = require("../../../config/jwt/jwt.config");

exports.addStockMe = async (user, stock, amount) => {
    console.log("주식 추가")
    try {
        console.log("유저", user);
        await stockMeRepository.save(stock, user, amount);
    } catch (error) {
        console.log(error);
    }
}

exports.deleteStock = async (amount, user, stock) => {
    try {
        return await stockMeRepository.deleteStock(user, stock, amount);
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