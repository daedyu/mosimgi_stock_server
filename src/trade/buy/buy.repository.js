class BuyRepository {
    constructor (dataSource) {
        this.repository = dataSource.getRepository("Buy");
    }

    async save(buy) {
        return await this.repository.save(buy);
    }

    async deleteByBuyId(buy_id) {
        return await this.repository.delete({id: buy_id});
    }

    async updateAmount(buy) {
        return await this.repository.update({ id: buy.id }, { amount: buy.amount })
    }

    async findByIdAndDate(stock_id) {
        return await this.repository.createQueryBuilder('buy')
            .where('buy.stock_id = :stock_id', {stock_id})
            .andWhere('DATE(buy.created_at) = CURRENT_DATE')
            .orderBy('buy.created_at', 'DESC')
            .getMany();
    }

    async findByPriceAndId(stock_id, price) {
        if (stock_id == null || price == null) {
            throw new Error('Stock ID and Price are required.');
        }

        return await this.repository.createQueryBuilder('buy')
            .where('buy.stock_id = :stock_id', { stock_id })
            .andWhere('buy.price = :price', { price })
            .orderBy('buy.created_at', 'ASC')
            .getOne();
    }

    async deleteById(id) {
        await this.repository.delete(id);
    }
}

module.exports = BuyRepository;