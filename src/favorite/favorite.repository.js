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

    async findIsLike(userId, stockId) {
        let is_liked = await this.repository.createQueryBuilder('favorite')
            .where('favorite.user_id = :userId', { userId })
            .andWhere('favorite.stock_id = :stockId', { stockId })
            .getOne();
        return !!is_liked;
    }

    async findOneByUserAndStockId(userId, stockId) {
        return await this.repository.createQueryBuilder('favorite')
            .where('favorite.user_id = :userId', {userId})
            .andWhere('favorite.stock_id = :stockId', {stockId})
            .getOne();
    }

    async delete(userId, stockId) {
        return await this.repository.delete({
            user_id: userId,
            stock_id: stockId,
        });
    }
}

module.exports = FavoriteRepository;
