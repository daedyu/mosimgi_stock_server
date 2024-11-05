class TradeRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Trade');
    }

    async save(trade) {
        return await this.repository.save(trade);
    }

    async findByBuyerOrSellerId(userId) {
        return await this.repository.createQueryBuilder('trade')
            .where('trade.buyerId = :userId OR trade.sellerId = :userId', { userId })
            .getMany();
    }
}

module.exports = TradeRepository;