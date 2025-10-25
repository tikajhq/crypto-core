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
                pass: '[REDACTED]',
                host: this.CurrencyConfig.core_host,
                port: this.CurrencyConfig.core_port,
            }
        }, cb);
        this.networkInfo.messagePrefix = "\x18Bitcoin Signed Message:\n"
    }
}


module.exports = BTC;