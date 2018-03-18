const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");

class BTC extends Currency {
    constructor(options, cb) {
        super("btc");
        this.api = new RPCService({
            currency: this.notation,
            minConfirmations: 1,
            confirmationRefreshInterval: 1000 * 10,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core,
                port: '8332',
            }
        }, cb);

    }
}


module.exports = BTC;