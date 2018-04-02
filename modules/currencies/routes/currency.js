const utils = require("./utils");
const routes = require('express').Router();
const Wallets = require("./../models/Wallets");
const Currencies = require("./../services/Currencies");
const Rates = require("./../services/RateSync");

routes.get('/list', (req, res) => {
    res.json({data: Rates.getRates()})
});

routes.get('/:currency/send', (req, res) => {
    // TODO: Shoot it to the queue.
    let currencyName;
    if (!(currencyName = utils.validCurrency(req, res)))
        return;

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
});

routes.get('/:currency/generate_wallet', (req, res) => {
    let currencyName;
    if (!(currencyName = utils.validCurrency(req, res)))
        return;

    let currency = Currencies.getInstance(currencyName);
    let generated = currency.generateWallet();

    //if save
    if (req.query['save']) {
        Wallets.register(_.assign({}, generated, {
            owner: "blockage",
            currency: currencyName
        }), (err, result) => {
            if (err) {
                console.log("Error in registering the wallet.");
                console.log(err);
            }
            //update watchlist.
            Currencies.syncWatchList(currencyName);
        });
        delete generated['secret'];
        delete generated['key'];
    }

    return res.json({data: generated})
});

routes.get('/:currency/get_balance', (req, res) => {
    let currencyName;
    if (!(currencyName = utils.validCurrency(req, res)))
        return;

    let currency = Currencies.getInstance(currencyName);


    let address = req.query['address'];
    if (!address)
        return res.status(500).send({error: "`address` is missing."});

    currency.getBalance(address, (err, success) => {
        if (err)
            return res.status(500).send({error: "error in getting balance.", ref: err});
        return res.json({data: success});
    })
});

routes.get('/:currency/watchlist', (req, res) => {
    let currencyName;
    if (!(currencyName = utils.validCurrency(req, res)))
        return;

    if (req.query['sync'])
        Currencies.syncWatchList(req.params.currency, (list) => res.send({data: list}));
    else {
        let currency = Currencies.getInstance(currencyName);
        currency.getWatchAddresses((list) => res.send({data: list}));
    }


});


module.exports = routes;