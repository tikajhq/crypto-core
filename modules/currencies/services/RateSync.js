let rp = require('request-promise');

/**
 * For refreshing exchange rates.
 * @type {{CURRENCY_LIMITS: number, APIEndpoint: string, REFRESH_INTERVAL: number, ratesData: {}, updateRates: RefreshService.updateRates, init: RefreshService.init}}
 */
let RefreshService = {
    CURRENCY_LIMITS: 0,
    AVAILABLE_CURRENCIES: [],
    MORE_AVAILABLE_CURRENCIES: ['xrp', 'btc', 'doge', 'dash', 'eth', 'xmr', 'neo', 'qtum', 'dgb', 'lsk'],
    APIEndpoint: "https://api.coinmarketcap.com/v1/ticker/",
    REFRESH_INTERVAL: 5 * 60 * 1000,
    ratesData: {},
    enabledRates: {},
    updateRates: function () {

        rp(this.APIEndpoint + "?limit=" + this.CURRENCY_LIMITS + "&convert=inr")
            .then((data) => {
                console.log("Synced rates.");
                // console.log("Pulled.");
                //todo: save in db.
                data = JSON.parse(data);
                DB.collection('rates').insertOne({data, timestamp: +(new Date())});
                data.forEach((item) => {
                    let currencyName = item.symbol.toLowerCase();
                    let defaultWallet = CONFIG.getDefaultWallet(currencyName)||{};
                    this.ratesData[currencyName] = item;
                    if (this.AVAILABLE_CURRENCIES.indexOf(currencyName) !== -1 || this.MORE_AVAILABLE_CURRENCIES.indexOf(currencyName) !== -1) {
                        // Create object for all enabled.
                        this.enabledRates[currencyName] = {
                            name: item.name,
                            symbol: item.symbol,
                            rates: {
                                tik: item.price_btc,
                                inr: item.price_inr,
                                usd: item.price_usd,
                                btc: item.price_btc,
                            },
                            changes: {
                                h1: item.percent_change_1h,
                                h24: item.percent_change_24h,
                                d7: item.percent_change_7d,
                            },
                            last_updated: item.last_updated,
                            address: defaultWallet.address
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

    init: function (AVAILABLE_CUR) {
        this.AVAILABLE_CURRENCIES = AVAILABLE_CUR;
        this.updateRates();
        setInterval(this.updateRates, this.REFRESH_INTERVAL);
    },

    getRates: function () {
        return this.enabledRates;
    }

};
RefreshService.updateRates = RefreshService.updateRates.bind(RefreshService);
RefreshService.getRates = RefreshService.getRates.bind(RefreshService);


module.exports = RefreshService;