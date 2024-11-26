const { AppDataSource } = require('../data-source');
const {getEmail} = require("../../config/jwt/jwt.config");
const TradeRepository = require("./trade.repository");
const UserRepository = require("../user/user.repository");
const BuyRepository = require("./buy/buy.repository");
const SellRepository = require("./sell/sell.repository");
const {MustBeEntityError} = require("typeorm");
const JwtExpiryError = require("../../config/jwt/JwtExpiryError");
const {deleteStock, addStockMe} = require("../stock/me/stock.me.usecase");

const tradeRepository = new TradeRepository(AppDataSource);
const userRepository = new UserRepository(AppDataSource);

const buyRepository = new BuyRepository(AppDataSource);
const sellRepository = new SellRepository(AppDataSource);
const socketService = require("../../config/socket/socket.service");

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
    try {
        const stock = req.body.stock_id;
        const price = req.body.price;
        const amount = req.body.amount;
        const user = await userRepository.findByEmail(await getEmail(req.headers.authorization));

        if (!await deleteStock(amount, user.id, stock)) {
            return res.status(400).json({ message: '보유 수량보다 많음'});
        }

        const buy = await buyRepository.findByPriceAndId(stock, price);

        if (!user) {
            return res.status(401).send({message: "유저를 찾을 수 없습니다."});
        }

        if (!buy) {
            const sellOrder = await sellRepository.save(
                {
                price: price,
                amount: amount,
                seller_id: user.id,
                stock_id: stock
                }
            );

            return res.status(200).json(sellOrder);
        }

        let sellResult;

        if (buy.amount > amount) {
            buy.amount = buy.amount - amount;
            await buyRepository.updateAmount(buy);
        } else if (buy.amount === amount) {
            await buyRepository.deleteByBuyId(buy.id);
        }
        else if (buy.amount < amount) {
            await buyRepository.deleteByBuyId(buy.id);
            sellResult = await sellRepository.save({
                price: price,
                amount: amount - buy.amount,
                seller_id: user.id,
                stock_id: stock
            })
        }

        let tradeResult = await tradeRepository.save({
            price: buy.price,
            stock_id: buy.stock_id,
            seller_id: buy.buyer_id,
            buyer_id: user.id
        });

        socketService.instance.updatePrice(stock, {
            value: tradeResult.price,
            date: tradeResult.created_at,
        })

        return res.status(200).json(
            {
                sellResult,
                tradeResult
            }
        );
    } catch(error) {
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

        let buyResult;

        if (sell.amount > amount) {
            sell.amount = sell.amount - amount;
            await sellRepository.updateAmount(sell);
        }
        else if (sell.amount === amount) {
            await sellRepository.deleteBySellId(sell.id);
        }
        else if (sell.amount < amount) {
            await sellRepository.deleteBySellId(sell.id);
            buyResult = await buyRepository.save({
                price: price,
                amount: (amount - sell.amount),
                buyer_id: user.id,
                stock_id: stock}
            )
        }

        console.log("주식 추가 호출")
        await addStockMe(user.id, stock, amount);

        let tradeResult = await tradeRepository.save({
            price: sell.price,
            stock_id: sell.stock_id,
            seller_id: sell.seller_id,
            buyer_id: user.id
        });

        socketService.instance.updatePrice(stock, {
            value: tradeResult.price,
            date: tradeResult.created_at,
        })

        return res.status(200).json(
            {
                buyResult,
                tradeResult
            }
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