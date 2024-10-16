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
        const email = await getEmail(token);
        const user = await userRepository.findByEmail(email);
        const myTrade = await tradeRepository.findByBuyerOrSellerId(user.id);
        return res.status(200).json(myTrade);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve email', error });
    }
}

exports.sellStock = async (req, res) => {

}

exports.buyStock = async (req, res) => {
    try {
        const stock = req.body.stock_id;
        const price = req.body.price;
        const amount = req.body.amount;
        const user = await userRepository.findByEmail(await getEmail(req.headers.authorization));

        const sell = await sellRepository.findByPriceOrderDate(stock, price);

        if (!user) {
            return res.status(401).send({message: "유저를 찾을 수 없습니다."});
        }

        if (!sell) {
            const buyOrder = await buyRepository.save({
                price: price,
                amount: amount,
                buyer_id: user.id,
                stock_id: stock}
            )

            return res.status(200).json(buyOrder);
        }

        if (sell.amount > amount) {
            sell.amount = sell.amount - amount;
            await sellRepository.updateAmount(sell);
        }
        else if (sell.amount === amount) {
            await sellRepository.deleteBySellId(sell.id);
        }
        else if (sell.amount < amount) {
            await sellRepository.deleteBySellId(sell.id);
            await buyRepository.save({
                price: price,
                amount: (amount - sell.amount),
                buyer_id: user.id,
                stock_id: stock}
            )
        }

        return res.status(200).json(
            await tradeRepository.save({
                price: sell.price,
                stock_id: sell.stock_id,
                seller_id: sell.seller_id,
                buyer_id: user.id
            })
        );

    } catch (error) {
        if (error instanceof JwtExpiryError) {
            return res.status(403).send({message: "토큰이 만료되었습니다.", error});
        }

        if (error instanceof MustBeEntityError) {
            return res.status(400).send({message: "입력이 없습니다.", error});
        }

        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve stock', error });
    }
}