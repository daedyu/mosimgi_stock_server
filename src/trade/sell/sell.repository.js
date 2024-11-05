const NullOrderError = require("../exception/NullOrderError");
const {MustBeEntityError} = require("typeorm");

class SellRepository {
    constructor (dataSource) {
        this.repository = dataSource.getRepository("Sell");
    }

    async deleteBySellId(sell_id) {
        return await this.repository.delete({id: sell_id});
    }

    async save(sell) {
        return await this.repository.save(sell);
    }

    async updatePrice(sell, user_id) {
        return await this.repository.update({seller_id: user_id}, { price: sell.price })
    }

    async updateAmount(sell) {
        return await this.repository.update({ id: sell.id }, { amount: sell.amount })
    }

    async updatePriceAndAmount(sell, user_id) {
        return await this.repository.update({ seller_id: user_id }, { price: sell.price, amount: sell.amount })
    }

    async findByPriceOrderDate(stock_id, price) {
        if (stock_id == null || price == null) {
            throw new Error('Stock ID and Price are required.');
        }

        return await this.repository.createQueryBuilder('sell')
            .where('sell.stock_id = :stock_id', {stock_id})
            .andWhere('sell.price = :price', {price})
            .orderBy('sell.created_at', 'ASC')
            .getOne();

    }
}

module.exports = SellRepository;