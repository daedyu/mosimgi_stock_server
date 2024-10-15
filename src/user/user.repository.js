class UserRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('User');
    }

    async findByEmail(email) {
        return this.repository.findOne({ where: { email } });
    }
}
module.exports = UserRepository;
