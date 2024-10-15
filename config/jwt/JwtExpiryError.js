class JwtExpiryError extends Error {
    constructor() {
        super("jwt expired");
    }
}

module.exports = JwtExpiryError;