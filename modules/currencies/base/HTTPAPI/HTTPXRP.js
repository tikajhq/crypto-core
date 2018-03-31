const HTTPAPI = require("./HTTPAPI");

class HTTPXRP extends HTTPAPI {
    constructor(currency) {
        super(currency, {
            host: "https://data.ripple.com/v2/",
            endpoints: {
                "get_balance": "accounts/[address]/balances?currency=XRP",
                "get_unspent": "/main/addrs/[address]?unspentOnly=true",
            }
        });
    }


    getBalance(address, cb) {
        return this.makeAPICall('get_balance', {address}, (err, response) => {
            if (err || response.result === 'error')
                return cb(err);
            let balance = 0;
            for (let i = 0; i < response.balances.length; ++i) {
                if (response.balances[i].currency === "XRP") {
                    balance = response.balances[i].value;
                    break
                }
            }
            cb(null, balance)
        });
    }

    getUTXO(address, cb) {
        cb(null, []);
        return false;
    }


}

HTTPXRP.SUPPORTED_CURRENCIES = ['xrp'];

module.exports = HTTPXRP;