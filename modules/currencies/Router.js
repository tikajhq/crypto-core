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

exports.send = function (req, res) {
    // TODO: Shoot it to the queue.
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

exports.generateWallet = function (req, res) {
    // TODO: Shoot it to the queue.
    let currencyName = req.params.currency;
    if (!currencyName || CONFIG.AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
        return res.status(500).send({error: "Unsupported currency requested."});
    let currency = Currencies.getInstance(currencyName);
    return res.json({data: currency.generateWallet()})
};


exports.syncWallets = function (req, res) {
    // TODO: Shoot it to the queue.
    let currencyName = req.params.currency;
    if (!currencyName || CONFIG.AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
        return res.status(500).send({error: "Unsupported currency requested."});
    Currencies.syncWatchList(req.params.currency, (list) => res.send(list));
};
