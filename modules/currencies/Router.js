const Currencies = require("./services/Currencies");
const Rates = require("./services/RateSync");

/**
 * @api {get} /api/currencies/list List currencies
 * @apiGroup Currency
 * @apiDescription List all available currencies along with default system wallets.
 *
 * @apiError (500) {object} error Object describing error.
 *
 * @apiSuccess {object} data Object with keys as currencies notations & values as object with address and other info.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 {
     "data": {
        "xrp": {
            "address": "rP2D9UygcwjmoX196ZtgYQNZKx1D6CEq8S"
        }
      }
 }
 */
exports.list_all = function (req, res) {
    res.json({data: Rates.getRates()})
};

/**
 * @api {get} /api/currencies/:currency/send Send currencies.
 * @apiGroup Currency
 * @apiDescription Provides method to send certain amount from core to different addresses.
 *
 * @apiParam {Number} to Address of wallet to transfer funds to.
 * @apiParam {Number} amount Number of currencies to be transferred. Can be in decimal.
 *
 * @apiError (500) {object} error Object describing error.
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 500
 {
     "error": "`amount` is missing."
 }

 * @apiSuccess {object} data Response received from server
 */
exports.send = function (req, res) {

    let currencyName = req.params.currency;
    if (!currencyName || CONFIG.AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
        return res.status(500).send({error: "Unsupported currency requested."});

    let to = req.query['to'];
    if (!to)
        return res.status(500).send({error: "`to` address is missing."});

    if (!req.query['amount'])
        return res.status(500).send({error: "`amount` is missing."});

    // if (!req.query['tag'])
    //     return res.status(500).send({error: "`tag` is missing."});

    //this should raise exception,
    //TODO: valid error message instead of exception
    let amount = parseFloat(req.query['amount']);


    let currency = Currencies.getInstance(currencyName);
    currency.send(to, amount, (err, success) => {
        if (err)
            return res.status(500).send({error: "error in sending amount.", ref: err});
        return res.json({data: success});
    }, req.query['tag']);
};


/**
 * @api {get} api/currencies/:currency/generate_wallet Generate wallet.
 * @apiGroup Currency
 * @apiDescription Generate a wallet using this key
 *
 * @apiError (500) {object} error Object describing error.
 * @apiSuccess {object} data Wallet with <code>address</code> and <code>secret</code>.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 {
    "data": {
        "secret": "snqUwLxaz2ex11X2FUhek6nFjLryX",
        "address": "r4DuKiRD83W2gJLJMCMokXfDKAFnCfRxmf"
    }
}
 */
exports.generateWallet = function (req, res) {
    let currencyName = req.params.currency;
    if (!currencyName || CONFIG.AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
        return res.status(500).send({error: "Unsupported currency requested."});
    let currency = Currencies.getInstance(currencyName);
    return res.json({data: currency.generateWallet()})
};
