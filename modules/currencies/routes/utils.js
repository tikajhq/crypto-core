module.exports = {
    validCurrency: (req, res, cb) => {
        let currencyName = req.params.currency;
        if (!currencyName || CONFIG.AVAILABLE_CURRENCIES.indexOf(currencyName) === -1) {
            res.status(500).send({error: "Unsupported currency requested."});
            return false
        }
        return currencyName;
    }
};