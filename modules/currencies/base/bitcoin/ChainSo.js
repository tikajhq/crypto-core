const HTTPAPI = require("./HTTPAPI");

class ChainSo extends HTTPAPI {
    constructor(currency) {
        super(currency, {
            host: " https://chain.so/api/v2/",
            endpoints: {
                "get_balance": "get_address_balance/" + currency + "/[address]",
                "get_received": "get_address_received/" + currency + "/[address]",
                "get_sent": "get_address_spent/" + currency + "/[address]",
                "get_unspent": "get_tx_unspent/" + currency + "/[address]",
                "get_tx_received": "get_tx_received/" + currency + "/[address]",
                "get_transaction": "get_tx/" + currency + "[txid]",
                "get_block": "get_blockhash/" + currency + "/[hash]",
            }
        })
    }


    getBalance(address, cb) {
        return this.makeAPICall('get_balance', {address}, (err, response) => {
            if (err || response.status !== "success")
                return cb(err);
            cb(null, response.data.confirmed_balance)
        });
    }

    getUTXO(address, cb) {
        return this.makeAPICall('get_unspent', {address}, (err, response) => {
            if (err || response.status !== "success")
                return cb(err);
            let txs = response.data.txs.map((item) => {
                return {"txid": item.txid, index: item.output_no, value: parseFloat(item.value)}
            });
            cb(null, txs)
        });
    }


}


module.exports = ChainSo;