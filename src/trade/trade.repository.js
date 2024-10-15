class TradeRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Trade');
    }

    save(trade) {
        return this.repository.save(trade);
    }

    findByBuyerOrSellerId(userId) {
        return this.repository.createQueryBuilder('trade')
            .where('trade.buyerId = :userId OR trade.sellerId = :userId', { userId })
            .getMany();
    }
}

module.exports = TradeRepository;