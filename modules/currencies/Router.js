const path = require("path");

const AVAILABLE_CURRENCIES = [
    "xrp"
];

/*
 * This code is for initialization & setup.
 *  This needs to be moved somewhere clean
 */
let currenciesInfo = {};
let instances = {};

function onNewTx(tx, raw) {
    console.log(tx);
}

(function init() {
    AVAILABLE_CURRENCIES.forEach((currencyName) => {
        let Currency = require(path.join(__dirname, currencyName));
        let currency = new Currency({}, () => {
            //setup basic info for API
            currenciesInfo[currencyName] = {"address": currency.primaryWallet.address};
            currency.listenForIncomingTX();
        });
        currency.on("incomingTX", onNewTx);

        instances[currencyName] = currency;
    })
})();


/**
 * @api {get} /currencies/list List currencies
 * @apiGroup Currency
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
    res.json({data: currenciesInfo})
};

/**
 * @api {get} /currencies/:currency/send Send currencies.
 * @apiGroup Currency
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
    if (!currencyName || AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
        return res.status(500).send({error: "Unsupported currency requested."});

    let to = req.query['to'];
    if (!to)
        return res.status(500).send({error: "`to` address is missing."});

    if (!req.query['amount'])
        return res.status(500).send({error: "`amount` is missing."});

    //this should raise exception,
    //TODO: valid error message instead of exception
    let amount = parseFloat(req.query['amount']);

    let currency = instances[currencyName];
    currency.send(to, amount, (err, success) => {
        if (err)
            return res.status(500).send({error: "error in sending amount.", ref: err});
        return res.json({data: success});
    });
};


/**
 * @api {get} /currencies/:currency/generateWallet Generate wallet.
 * @apiGroup Currency
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
exports.getWallet = function (req, res) {
    let currencyName = req.params.currency;
    if (!currencyName || AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
        return res.status(500).send({error: "Unsupported currency requested."});
    let currency = instances[currencyName];
    return res.json({data: currency.generateWallet()})
};
