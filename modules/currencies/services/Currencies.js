const path = require("path");
const Wallets = require("../models/Wallets");
const ExternalCallbacks = require("./ExternalCallbacks");
const AutoTransact = require("./AutoTransact");


let Currencies = {
    instances: {},
    currenciesList: [],
    init: function (currenciesList) {
        this.currenciesList = currenciesList;
        //get some data about currencies
        currenciesList.forEach((currencyName) => {
            let Currency = require(path.join(__dirname, "/../crypto", currencyName));
            let currency = new Currency({}, () => {
                // console.log(currency)
                //setup basic info for API
                currency.listenForIncomingTX();
            });
            // TODO: Shoot it to the queue.
            currency.on("confirmed_tx", (tx, rawtx) => {
                logger.info(tx);
                logger.info(rawtx);
                AutoTransact.processTX(currency, tx);
                ExternalCallbacks.onNewTx(tx, rawtx, "confirmed")
            });
            currency.on("unconfirmed_tx", (tx, rawtx) => {
                logger.info(tx);
                // logger.info(rawtx);
                ExternalCallbacks.onNewTx(tx, rawtx, "unconfirmed")
            });

            currency.on("incoming_tx", (tx, rawtx) => {
                // logger.info(tx);
                //logger.info(rawtx);
                // AutoTransact.processTX(currency,tx);
                // ExternalCallbacks.onNewTx(tx, rawtx,"incoming")
            });

            //create an instance
            this.instances[currencyName] = currency;

            //create an initial sync of wallets
            this.syncWatchList(currencyName);
        })
    },

    syncWatchList(currencyName, cb) {
        if (!currencyName || this.currenciesList.indexOf(currencyName) === -1)
            return null;

        // // Add currencies secondary address in watchlist too.
        CONFIG.currencies[currencyName].wallets.forEach((info) => {
            this.instances[currencyName].addWatchAddresses(info.address);
        });
        return Wallets.getWalletsAddress(currencyName, (list) => {
            this.instances[currencyName].addWatchAddresses(list);
            cb && cb(this.instances[currencyName].watchAddresses);
        })
    },

    getInstance: function (currencyName) {
        if (!currencyName || this.currenciesList.indexOf(currencyName) === -1)
            return null;
        return this.instances[currencyName];
    }

};
Currencies.getInstance = Currencies.getInstance.bind(Currencies);

module.exports = Currencies;
