class StockMeRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository("StockMe");
    }

    async save(stockId, userId, amount) {
        const records = Array.from({ length: amount }, () => ({
            stock_id: stockId,
            user_id: userId,
            created_at: new Date(),
        }));

        return await this.repository.save(records);
    }

    async findByUserId(userId) {
        return await this.repository
            .createQueryBuilder('stock_me', 'sm')
            .select('sm.stock_id', 'stockId')
            .addSelect('COUNT(sm.stock_id)', 'count')
            .innerJoin('sm.stock', 'stock') // 필요에 따라 stock 정보도 가져오기
            .where('sm.user_id = :userId', { userId })
            .groupBy('sm.stock_id')
            .getRawMany();
    }

    async deleteStock(userId, stockId, count) {
        const stockCount = await this.repository
            .createQueryBuilder('sm')
            .where('stock_id = :stockId', { stockId })
            // .where(sm.user_id = :userId', { userId })
            .andWhere('sm.stock_id = :stockId', { stockId })
            .getCount();

        if (count > stockCount) {
            return null;
        }

        const records = await this.repository
            .createQueryBuilder('sm')
            .where('sm.user_id = :userId', { userId })
            .andWhere('sm.stock_id = :stockId', { stockId })
            .orderBy('sm.created_at', 'ASC')
            .limit(count)
            .getMany();

        if (records.length > 0) {
            const ids = records.map(record => record.id);
            await this.repository
                .createQueryBuilder()
                .delete()
                .from('stock_me')
                .whereInIds(ids)
                .execute();
        }

        return records.length;
    }
}

module.exports = StockMeRepository;