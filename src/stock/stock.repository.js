class StockRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Stock');
    }

    async findByLike(userId) {
        const result = await this.repository.createQueryBuilder('stock')
            .leftJoin('stock.trades', 'trade') // stock과 trade 테이블을 조인
            .leftJoin('favorite', 'favorite', 'favorite.stock_id = stock.id AND favorite.user_id = :userId', { userId }) // favorite 테이블과 조인
            .select([
                'stock.id AS stock_id',
                'stock.name AS stock_name',
                'stock.description AS stock_description',
                'MAX(trade.price) AS trade_price' // 최신 거래 가격
            ])
            .where('favorite.user_id = :userId OR favorite.user_id IS NOT NULL') // 좋아요한 주식만 필터링, 없으면 null 상태로 허용
            .groupBy('stock.id')
            .orderBy('stock.id', 'ASC')
            .getRawMany();

        console.log(result);

        // 좋아요한 주식이 없다면 빈 배열 반환
        return result;
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
