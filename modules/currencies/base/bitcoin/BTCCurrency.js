//https://github.com/trezor/trezor-common/blob/master/coins.json
//https://github.com/trezor/trezor-core/blob/master/src/apps/common/coins.py
// https://github.com/ShieldCoin/SHIELD-android

const Currency = require("./../../base/Currency");
const RPCService = require("./../../base/bitcoin/RPCService");
const ChainSo = require("./ChainSo");

let bitcoinjs = require('bitcoinjs-lib');
let CoinKey = require('coinkey');
let coinInfo = require('coininfo');


class BTCCurrency extends Currency {
    constructor(notation) {
        super(notation);
        this.currencyInfo = coinInfo(this.notation).versions;
        this.networkInfo = coinInfo(this.notation).toBitcoinJS();
        this.divisionFactor = 100000000;

        //if its one of currency supported by chain.so, use it.
        if (['btc', 'ltc', 'doge', 'dash'].indexOf(notation) !== -1)
            this.HTTPAPI = new ChainSo(notation)
    }

    normalizeToSatoshis(value) {
        return Math.round((1.0 * value) * this.divisionFactor);
    }

    waitForConfirmation(tx, rawtx) {
        this.onWaitingForConfirmation(tx, rawtx);
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


    transfer(transaction, cb) {
        const self = this;

        transaction.fee = (transaction.fee || this.fee);
        //convert value to satoshis
        let value = transaction.value;
        this.HTTPAPI.getUTXO(transaction.source.address, (err, outputs) => {
            if (err) {
                console.error("An error occured while transferring from " + transaction.source.address + " to " + transaction.destination + " value:" + value);
                console.error(err);
            }

            if (outputs.length === 0) {
                return console.log("Wallet is empty.");
            }

            let netBalance = 0;
            let tx = new bitcoinjs.TransactionBuilder(this.networkInfo);


            // add each utxo as input.
            outputs.forEach((utxo) => {
                netBalance += utxo.value * 1;
                tx.addInput(utxo.txid, utxo.index);
            });

            // see if balance is upto mark.
            if (netBalance < (value + transaction.fee))
                return console.log("Wallet balance is less than transfer. " + netBalance);

            //if empty wallet flag is true, don't leave anything. Ignore value
            if (transaction.emptyWallet)
                value = netBalance - transaction.fee;

            /**
             * Calculations
             */
            if (self.normalizeToSatoshis(value) === 0)
                return console.log("Trying to send 0 units. Sick!");
            tx.addOutput(transaction.destination, self.normalizeToSatoshis(value));

            //check if anything remains after this tx.
            let remaining = netBalance - value - transaction.fee;
            if (remaining > transaction.fee)
                tx.addOutput(transaction.source.address, self.normalizeToSatoshis(remaining));


            /**
             * Section for signing & submission
             */
                //get the private key/
            let keyPair = bitcoinjs.ECPair.fromWIF(transaction.source.secret, this.networkInfo);

            // sign all inputs with valid key.
            for (let i = 0; i < outputs.length; ++i) {
                // Sign the first input with the key.
                tx.sign(i, keyPair);
            }
            //get raw tx
            let txHex = tx.build().toHex();
            console.log(txHex);
            if (this.ACTUAL_TRANSFER) {
                self.api.broadcastTX(txHex, (error, response) => {
                    if (error) console.log(error);
                    console.log(response);
                    cb(err, response);
                });
            } else
                cb(null, txHex);
        });
    }
}


module.exports = BTCCurrency;