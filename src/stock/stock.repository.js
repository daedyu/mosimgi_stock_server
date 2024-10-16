class StockRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Stock');
    }

    async findAll() {
        return await this.repository.find();
    }

    async findByName(name) {
        return await this.repository.findOne({ where: { name } });
    }

    async save(stock) {
        return await this.repository.save(stock);
    }
}

module.exports = StockRepository;
