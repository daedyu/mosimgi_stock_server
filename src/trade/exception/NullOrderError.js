class NullOrderError extends Error {
    constructor() {
        super("can't find buy/sell order");
    }
}

module.exports = NullOrderError;