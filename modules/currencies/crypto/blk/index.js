const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");

class BLK extends Currency {
    constructor(options, cb) {
        super("blk");
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
        this.networkInfo.messagePrefix = "\x18BlackCoin Signed Message\n"
    }
}


module.exports = BLK;