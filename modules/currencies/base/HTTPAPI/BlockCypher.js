const HTTPAPI = require("./HTTPAPI");


class BlockCypher extends HTTPAPI {
    constructor(currency) {

        super(currency, {
            //only for testing purposese, set CORRUPT_BLOCKCYPHER
            host: "https://api.blockcypher.com/v1/" + (global['CORRUPT_BLOCKCYPHER'] ? "/random/" : ""),
            endpoints: {
                "get_balance": currency + "/main/addrs/[address]/balance",
                "get_unspent": currency + "/main/addrs/[address]?unspentOnly=true",
            }
        });
    }


    getBalance(address, cb) {
        return this.makeAPICall('get_balance', {address}, (err, response) => {
            if (err || response.error)
                return cb(err);

            cb(null, parseFloat(response.final_balance) / CONFIG.SATOSHIS)
        });
    }

    getUTXO(address, cb) {
        //no utxo for eth
        if (this.notation === "eth")
            return cb(null, []);
        return this.makeAPICall('get_unspent', {address}, (err, response) => {
            if (err || response.error)
                return cb(err);

            let txs = response.txrefs.map((item) => {
                return {
                    "txid": item.tx_hash,
                    index: item.tx_output_n,
                    value: parseFloat(item.value) / CONFIG.SATOSHIS,
                    confirmations: item.confirmations
                }
            });
            cb(null, txs)
        });
    }


}

BlockCypher.SUPPORTED_CURRENCIES = ['btc', 'ltc', 'doge', "eth"];

module.exports = BlockCypher;