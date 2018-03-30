const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");

class DGB extends Currency {
    constructor(options, cb) {
        super("dgb");
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
        this.fee = 0.1;
        this.networkInfo.messagePrefix = '\x19DigiByte Signed Message:\n';

    }
}


module.exports = DGB;