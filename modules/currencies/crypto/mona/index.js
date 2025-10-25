const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");


/**
 * COULDN'T BE USED WITH CURRENT CODE BECUASE NO XPUB KEY
 */
class MONA extends Currency {
    constructor(options, cb) {
        super("mona");
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
        this.networkInfo.messagePrefix = "\x18Monacoin Signed Message\n"
    }
}


module.exports = MONA;