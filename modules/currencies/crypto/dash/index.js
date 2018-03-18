const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");

class Doge extends Currency {
    constructor(options, cb) {
        super("dash");
        this.divisionFactor = 1;
        this.api = new RPCService({
            currency: this.notation,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core,
                port: '9998',
            }
        }, cb);
    }
}


module.exports = Doge;