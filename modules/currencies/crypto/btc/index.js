const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");

class BTC extends Currency {
    constructor(options, cb) {
        super("btc");
        this.api = new RPCService({
            currency: this.notation,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core,
                port: '8332',
            }
        }, cb);
        this.fee = 0.0002;
        this.networkInfo.messagePrefix = "\x18Bitcoin Signed Message:\n"
    }
}


module.exports = BTC;