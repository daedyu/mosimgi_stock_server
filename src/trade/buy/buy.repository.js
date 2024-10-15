class BuyRepository {
    constructor (dataSource) {
        this.repository = dataSource.getRepository("Buy");
    }

    save(buy) {
        return this.repository.save(buy);
    }

    async findByPriceOrderDate(stock_id, price) {
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