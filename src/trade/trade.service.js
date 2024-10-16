const { AppDataSource } = require('../data-source');
const {getEmail} = require("../../config/jwt/jwt.config");
const TradeRepository = require("./trade.repository");
const UserRepository = require("../user/user.repository");
const BuyRepository = require("./buy/buy.repository");
const SellRepository = require("./sell/sell.repository");
const NullOrderError = require("./exception/NullOrderError");
const {MustBeEntityError} = require("typeorm");
const JwtExpiryError = require("../../config/jwt/JwtExpiryError");

const tradeRepository = new TradeRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);

const buyRepository = new BuyRepository(AppDataSource);
const sellRepository = new SellRepository(AppDataSource);

exports.getMyTrade = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const email = getEmail(token);
        const user = await userRepository.findByEmail(email);
        const myTrade = await tradeRepository.findByBuyerOrSellerId(user.id);
        res.status(200).json(myTrade);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve email', error });
    }
}

exports.buyStock = async (req, res) => {
    try {
        const stock = req.body.stock_id;
        const price = req.body.price;
        const user = await userRepository.findByEmail(await getEmail(req.headers.authorization));

        const sell = await sellRepository.findByPriceOrderDate(stock, price);

        if (!user) {
            return res.status(401).send({message: "유저를 찾을 수 없습니다."});
        }

        if (!sell) {
            const buyOrder = await buyRepository.save({
                price: price,
                buyer_id: user.id,
                stock_id: stock}
            )

            res.status(200).json(buyOrder);
        }



    } catch (error) {
        if (error instanceof JwtExpiryError) {
            return res.status(403).send({message: "토큰이 만료되었습니다.", error});
        }

        if (error instanceof MustBeEntityError) {
            return res.status(400).send({message: "입력이 없습니다.", error});
        }

        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve stock', error });
    }
}