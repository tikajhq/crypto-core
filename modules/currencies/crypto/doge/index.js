const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");

class Doge extends Currency {
    constructor(options, cb) {
        super("doge");
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
        this.networkInfo.messagePrefix = '\x19Dogecoin Signed Message:\n';
    }
}


module.exports = Doge;