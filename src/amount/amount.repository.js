class AmountRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('Stock');
    }

    async findByUserId(user_id) {
        return await this.repository.findOne({ where: { user_id } });
    }

    async create(amount) {
        return await this.repository.save(amount);
    }

}

module.exports = AmountRepository;