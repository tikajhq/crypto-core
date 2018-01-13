const path = require("path");
let rp = require('request-promise');

const AVAILABLE_CURRENCIES = [
    "xrp"
];


let Currencies = {
    instances: {},
    currenciesInfo: {},

    onNewTx: function (tx, raw) {
        console.log(tx);
    },

    init: function () {
        //get some data about currencies
        AVAILABLE_CURRENCIES.forEach((currencyName) => {
            let Currency = require(path.join(__dirname, currencyName));
            let currency = new Currency({}, () => {
                //setup basic info for API
                this.currenciesInfo[currencyName] = {"address": currency.primaryWallet.address};
                currency.listenForIncomingTX();
            });
            currency.on("incomingTX", this.onNewTx);
            this.instances[currencyName] = currency;
        })
    },

    getInstance: function (currencyName) {
        if (!currencyName || AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
            return null;
        console.log(this);
        return this.instances[currencyName];
    }

};
Currencies.onNewTx = Currencies.onNewTx.bind(Currencies);
Currencies.getInstance = Currencies.getInstance.bind(Currencies);


/**
 * For refreshing exchange rates.
 * @type {{CURRENCY_LIMITS: number, APIEndpoint: string, REFRESH_INTERVAL: number, ratesData: {}, updateRates: RefreshService.updateRates, init: RefreshService.init}}
 */
let RefreshService = {
    CURRENCY_LIMITS: 100,
    APIEndpoint: "https://api.coinmarketcap.com/v1/ticker/",
    REFRESH_INTERVAL: 5 * 60 * 1000,
    ratesData: {},
    updateRates: function () {
        rp(this.APIEndpoint + "?limit=" + this.CURRENCY_LIMITS + "&convert=inr")
            .then((data) => {
                data.forEach((item) => {
                    this.ratesData[item.symbol.toLowerCase()] = item;
                })
            })
            .catch(function (err) {
                // Crawling failed...
                // ignore for now.
            });
    },

    init: function () {
        this.updateRates();
        setInterval(this.updateRates, this.REFRESH_INTERVAL);
    }

};
RefreshService.updateRates = RefreshService.updateRates.bind(RefreshService);


exports.init = function () {
    Currencies.init();
    RefreshService.init();
};


exports.AVAILABLE_CURRENCIES = AVAILABLE_CURRENCIES;
exports.getInstance = Currencies.getInstance;
exports.currenciesInfo = Currencies.currenciesInfo;