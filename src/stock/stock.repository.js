class StockRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Stock');
    }

    findAll() {
        return this.repository.find();
    }

    findByName(name) {
        return this.repository.findOne({ where: { name } });
    }

    save(stock) {
        return this.repository.save(stock);
    }

    // findByPriceRange(min, max) {
    //     return this.repository
    //         .createQueryBuilder('stock')
    //         .where('stock.price BETWEEN :min AND :max', { min, max })
    //         .getMany();
    // }
}

module.exports = StockRepository;
