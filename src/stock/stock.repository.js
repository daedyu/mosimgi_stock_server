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
                'MAX(trade.price) AS trade_price'
            ])
            .groupBy('stock.id')
            .orderBy('stock.id', 'ASC')
            .getRawMany();
    }

    async findById(id) {
        return await this.repository.findOne({ where: { id } });
    }

    async findByIdForTrades(id) {
        const stock = await this.repository.findOne({
            where: { id },
            relations: ['trades']
        });

        return stock.trades.map(trade => (
            {
                date: trade.created_at,
                value: trade.price
            }
        ));
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
