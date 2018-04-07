const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");


class LTC extends Currency {
    constructor(options, cb) {
        super("ltc");
        this.api = new RPCService({
            currency: this.notation,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core_host,
                port: this.CurrencyConfig.core_port,
            }
        }, cb);
        this.networkInfo.messagePrefix = "\x18Litecoin Signed Message:\n"
    }
}


module.exports = LTC;