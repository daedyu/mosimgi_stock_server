class FavoriteRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Favorite');
    }

    async save(userId, stockId) {
        return await this.repository.save({
            user_id: userId,
            stock_id: stockId,
        });
    }

    async findAllByUser(userId) {
        return await this.repository.find({user_id: userId});
    }

    async findIsLike(userId, stockId) {
        let is_liked = await this.repository.createQueryBuilder('favorite')
            .where('user_id', userId)
            .where('stock_id', stockId)
            .getRawOne();

        return !!is_liked;
    }

    async findOneByUserAndStockId(userId, stockId) {
        return await this.repository.createQueryBuilder('favorite')
            .where('user_id', userId)
            .where('stock_id', stockId)
            .getRawOne();
    }

    async delete(userId, stockId) {
        return await this.repository.delete({
            user_id: userId,
            stock_id: stockId,
        });
    }
}

module.exports = FavoriteRepository;
