const Currency = require("./../../base/Currency");
const RPCService = require("./../../base/bitcoin/RPCService");

let bitcoin = require('bitcoinjs-lib');
let CoinKey = require('coinkey');
let coinInfo = require('coininfo');


class BTC extends Currency {
    constructor(options, cb) {
        super("btc");
        this.currencyInfo = coinInfo(this.notation).versions;
        this.api = new RPCService({
            currency: this.notation,
            minConfirmations: 1,
            confirmationRefreshInterval: 1000 * 10,
            rpcConfig: {
                protocol: 'http',
                user: this.notation,
                pass: 's3cur3',
                host: this.CurrencyConfig.core,
                port: '8332',
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
        const self = this;
        //convert value to satoshis
        value = Math.round(value * self.divisionFactor);
        this.api.getUTXO(source.address, (err, outputs) => {
            if (err) {
                console.error("An error occured while transferring from " + source.address + " to " + destination + " value:" + value);
                console.error(err);
            }

            if (outputs.length === 0) {
                return console.log("Wallet is empty.");
            }

            let tx = new bitcoinjs.TransactionBuilder();


            let netBalance = 0;
            outputs.forEach((rawTX) => {
                netBalance += rawTX.value;
                tx.addInput(rawTX.tx_hash_big_endian, rawTX.tx_output_n);
            });
            if (netBalance < (value + self.fee))
                return console.log("Wallet balance is less than transfer. " + netBalance);

            console.log(destination, value);
            tx.addOutput(destination, value);
            let remaining = netBalance - value - self.fee;
            if (remaining > self.fee)
                tx.addOutput(source.address, remaining);

            let keyPair = bitcoinjs.ECPair.fromWIF(source.secret);

            for (let i = 0; i < outputs.length; ++i) {
                // Sign the first input with the new key
                tx.sign(i, keyPair);
            }
            let txHex = tx.build().toHex();
            console.log(txHex);
            if (this.ACTUAL_TRANSFER) {
                self.api.rpc.sendRawTransaction(txHex, (error, response) => {
                    if (error) console.log(error);
                    console.log(response);
                    cb(err, response);
                });
            } else
                cb(null, txHex);
        });
    }
}


module.exports = BTC;