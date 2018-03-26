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
                host: this.CurrencyConfig.core,
                port: '9332',
            }
        }, cb);
        this.fee = 0.001
    }
}


module.exports = LTC;