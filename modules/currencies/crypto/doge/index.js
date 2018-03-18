const Currency = require("./../../base/Currency");
const RPCService = require("./../../base/bitcoin/RPCService");

let bitcoin = require('bitcoinjs-lib');
let CoinKey = require('coinkey');
let coinInfo = require('coininfo');


class Doge extends Currency {
    constructor(options, cb) {
        super("doge");
        this.currencyInfo = coinInfo(this.notation).versions;
        this.api = new RPCService({
            currency: this.notation,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core,
                port: '22555',
            }
        }, cb);
    }

    waitForConfirmation(tx, rawtx) {
        return this.api.addTXForConfirmation([tx.txid]);
    }

    listenForIncomingTX() {
        //register
        this.api.newTXService();
        this.api.confirmationService();

        //on new received.
        this.api.on('transaction', (tx) => {
            this.onUTXO(this.api.normalizeTX(tx), tx);
        });
        this.api.on("confirmed", (tx) => {
            this.onConfirmedTX(this.api.normalizeTX(tx), tx)
        })
    }


    generateWallet() {
        let ck = new CoinKey.createRandom(this.currencyInfo);
        return {
            address: ck.publicAddress,
            secret: ck.privateWif,
            key: ck.privateKey.toString('hex'),
        }

    }

    send(to, value, cb) {
        //TODO: LOG
        return this.transfer(this.primaryWallet, to, value, cb);
    }

    transfer(source, destination, value, cb) {

    }
}


module.exports = Doge;