const { AppDataSource } = require('../data-source');
const FavoriteRepository = require("./favorite.repository");
const {getEmail} = require("../../config/jwt/jwt.config");
const UserRepository = require("../user/user.repository");
const StockRepository = require("../stock/stock.repository");

const userRepository = new UserRepository(AppDataSource);
const favoriteRepository = new FavoriteRepository(AppDataSource);
const stockRepository = new StockRepository(AppDataSource);

exports.AddOrDeleteFavorite = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const email = await getEmail(token);
        const user = await userRepository.findByEmail(email);
        const stock = await stockRepository.findById(req.query.stock);

        const existingFavorite = await favoriteRepository.findOneByUserAndStockId(user.id, stock.id);
        let response;

        if (existingFavorite) {
            response = !await favoriteRepository.delete(user.id, stock);
        } else {
            response = !!(await favoriteRepository.save(user.id, stock));
        }

        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve email', error });
    }
}