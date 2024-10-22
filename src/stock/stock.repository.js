class StockRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Stock');
    }

    async findAll() {
        return await this.repository.createQueryBuilder('stock')
            .leftJoin('stock.trades', 'trade')
            .select([
                'stock.id AS stock_id',
                'stock.name AS stock_name',
                'stock.description AS stock_description',
                'trade.price AS trade_price'
            ])
            .orderBy('stock.id', 'ASC')
            .getRawMany();
    }

    async findById(id) {
        return await this.repository.findOne({ where: { id } });
    }

    async findByName(name) {
        return await this.repository.findOne({ where: { name } });
    }

    async findMostTrade() {
        return await this.repository.createQueryBuilder('stock')
            .leftJoin('stock.trades', 'trade')
            .select([
                'stock.id AS stock_id',
                'stock.name AS stock_name',
                'stock.description AS stock_description',
                'MAX(trade.price) AS trade_price'
            ])
            .groupBy('stock.id')
            .orderBy('COUNT(trade.id)', 'DESC')
            .getRawMany();
    }

    async save(stock) {
        return await this.repository.save(stock);
    }
}

module.exports = StockRepository;
