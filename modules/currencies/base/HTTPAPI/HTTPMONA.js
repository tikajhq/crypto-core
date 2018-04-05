const HTTPAPI = require("./HTTPAPI");

class HTTPMONA extends HTTPAPI {
    constructor(currency) {
        super(currency, {
            host: "https://mona.chainsight.info/api/",
            endpoints: {
                "summary": "statistics/total",
                "get_balance": "addr/[address]/balance",
                "get_received": "addr/[address]/totalReceived",
                "get_sent": "addr/[address]/totalSent",
                "get_unspent": "addr/[address]/utxo",
            }
        });
    }

    getBalance(address, cb) {
        return this.makeAPICall('get_balance', {address}, (err, response) => {
            if (err)
                return cb(err);

            cb(null, parseFloat(response) / CONFIG.SATOSHIS)
        });
    }

    getUTXO(address, cb) {
        return this.makeAPICall('get_unspent', {address}, (err, response) => {
            if (err)
                return cb(err);
            let txs = response.map((item) => {
                return {
                    "txid": item.txid,
                    index: item.vout,
                    value: parseFloat(item.amount),
                    confirmations: item.confirmations
                }
            });
            cb(null, txs)
        });
    }


}

HTTPMONA.SUPPORTED_CURRENCIES = ["mona"];

module.exports = HTTPMONA;