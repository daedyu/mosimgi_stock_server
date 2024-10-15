const NullOrderError = require("../exception/NullOrderError");
const {MustBeEntityError} = require("typeorm");

class SellRepository {
    constructor (dataSource) {
        this.repository = dataSource.getRepository("Sell");
    }

    save(sell) {
        return this.repository.save(sell);
    }

    async findByPriceOrderDate(stock_id, price) {
        if (stock_id == null || price == null) {
            throw new Error('Stock ID and Price are required.');
        }


        const result = await this.repository.createQueryBuilder('sell')
            .where('sell.stock_id = :stock_id', {stock_id})
            .andWhere('sell.price = :price', {price})
            .orderBy('sell.created_at', 'ASC')
            .getOne();

        if (!result) {
            return null;
        }

        return result;

    }

    async deleteById(id) {
        await this.repository.delete(id);
    }
}

module.exports = SellRepository;