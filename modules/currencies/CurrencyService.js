const path = require("path");
let rp = require('request-promise');


const AVAILABLE_CURRENCIES = [
    "xrp",
    "btc",
    "doge"
];


let Currencies = {
    instances: {},
    onNewTx: function (tx, raw) {
        console.log("Sending new TX: " + JSON.stringify(tx));
        global.DB.collection('incomingtx').insertOne({tx, raw});
        let url = CONFIG.TX_ENDPOINT + "id=" + tx.id + "&currency=" + tx.currency + "&address=" + tx.from + "&units=" + tx.amount;
        if (tx['tag'])
            url += "&tag=" + tx.tag;

        console.log(url);
        rp.post(url, {
            form: {
                tx: JSON.stringify(tx),
                raw: JSON.stringify(raw)
            }
        })
            .then(data => {
                console.log(data);
            }).catch(console.log);
    },

    init: function () {
        //get some data about currencies
        AVAILABLE_CURRENCIES.forEach((currencyName) => {
            let Currency = require(path.join(__dirname, currencyName));
            let currency = new Currency({}, () => {
                //setup basic info for API
                // this.currenciesInfo[currencyName] = {"address": currency.primaryWallet.address};
                currency.listenForIncomingTX();
            });
            currency.on("incomingTX", this.onNewTx);
            this.instances[currencyName] = currency;
        })
    },

    getInstance: function (currencyName) {
        if (!currencyName || AVAILABLE_CURRENCIES.indexOf(currencyName) === -1)
            return null;
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
    enabledRates: {},
    updateRates: function () {
        console.log("Syncing rates...");
        rp(this.APIEndpoint + "?limit=" + this.CURRENCY_LIMITS + "&convert=inr")
            .then((data) => {
                console.log("Pulled.");
                //todo: save in db.
                data = JSON.parse(data);
                DB.collection('rates').insert({data, timestamp: +(new Date())});
                data.forEach((item) => {
                    let cur = item.symbol.toLowerCase();
                    this.ratesData[cur] = item;
                    if (AVAILABLE_CURRENCIES.indexOf(cur) !== -1 || ['xrp', 'btc', 'doge'].indexOf(cur) !== -1) {
                        // Create object for all enabled.
                        let instance = Currencies.getInstance(cur);
                        let address = '';
                        if (instance)
                            address = instance.primaryWallet.address;

                        this.enabledRates[cur] = {
                            name: item.name,
                            symbol: item.symbol,
                            rates: {
                                tik: item.price_inr,
                                usd: item.price_usd,
                                btc: item.price_btc,
                            },
                            changes: {
                                h1: item.percent_change_1h,
                                h24: item.percent_change_24h,
                                d7: item.percent_change_7d,
                            },
                            last_updated: item.last_updated,
                            address: address
                        }
                    }
                })
            })
            .catch(function (err) {
                console.log(err);
                // Crawling failed...
                // ignore for now.
            });
    },

    init: function () {
        this.updateRates();
        setInterval(this.updateRates, this.REFRESH_INTERVAL);
    },

    getRates: function () {
        return this.enabledRates;
    }

};
RefreshService.updateRates = RefreshService.updateRates.bind(RefreshService);
RefreshService.getRates = RefreshService.getRates.bind(RefreshService);


exports.init = function () {
    Currencies.init();
    RefreshService.init();
};


exports.AVAILABLE_CURRENCIES = AVAILABLE_CURRENCIES;
exports.getInstance = Currencies.getInstance;
exports.currenciesInfo = Currencies.currenciesInfo;
exports.getRates = RefreshService.getRates;
