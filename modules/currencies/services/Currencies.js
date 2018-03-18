const path = require("path");
const Wallets = require("../models/Wallets");
const ExternalCallbacks = require("./ExternalCallbacks");

let Currencies = {
    instances: {},
    currenciesList: [],
    init: function (currenciesList) {
        this.currenciesList = currenciesList;
        //get some data about currencies
        currenciesList.forEach((currencyName) => {
            let Currency = require(path.join(__dirname, "/../crypto", currencyName));
            let currency = new Currency({}, () => {
                //setup basic info for API
                currency.listenForIncomingTX();
            });
            //
            currency.on("confirmed_tx", (tx, rawtx) => {
                ExternalCallbacks.onNewTx(tx, rawtx)
            });
            //create an instance
            this.instances[currencyName] = currency;

            //create an initial sync of wallets
            this.syncWatchList(currencyName);
        })
    },

    syncWatchList(currencyName) {
        if (!currencyName || this.currenciesList.indexOf(currencyName) === -1)
            return null;
        return Wallets.getWalletsAddress(currencyName, (list) => {
            this.instances[currencyName].addWatchAddresses(list);
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
