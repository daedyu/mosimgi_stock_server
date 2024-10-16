class UserRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository('User');
    }

    async findByEmail(email) {
        return await this.repository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();
    }
}
module.exports = UserRepository;
