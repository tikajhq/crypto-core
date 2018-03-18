const Currency = require("./../../base/bitcoin/BTCCurrency");
const RPCService = require("./../../base/bitcoin/RPCService");


class QTUM extends Currency {
    constructor(options, cb) {
        super("qtum");
        this.api = new RPCService({
            currency: this.notation,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core,
                port: '3889',
            }
        }, cb);
    }

    transfer(source, destination, value, cb) {

    }
}


module.exports = QTUM;