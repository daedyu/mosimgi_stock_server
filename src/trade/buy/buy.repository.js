class BuyRepository {
    constructor (dataSource) {
        this.repository = dataSource.getRepository("Buy");
    }

    async save(buy) {
        return await this.repository.save(buy);
    }

    async findByPriceOrderDate(stock_id, price) {
        if (stock_id == null || price == null) {
            throw new Error('Stock ID and Price are required.');
        }

        return await this.repository.createQueryBuilder('buy')
            .where('buy.stockId = :stock_id', { stock_id })
            .andWhere('buy.price = :price', { price })
            .orderBy('buy.created_at', 'ASC')
            .getOne();
    }

    async deleteById(id) {
        await this.repository.delete(id);
    }
}

module.exports = BuyRepository;