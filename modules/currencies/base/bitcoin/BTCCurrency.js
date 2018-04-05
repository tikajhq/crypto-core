const Currency = require("./../../base/Currency");
const SuperResolver = require("../../base/HTTPAPI/SuperResolver");

let bitcoinjs = require('bitcoinjs-lib');
let CoinKey = require('coinkey');
let coinInfo = require('coininfo');


class BTCCurrency extends Currency {
    constructor(notation) {
        super(notation);
        this.currencyInfo = coinInfo(this.notation).versions;
        this.networkInfo = coinInfo(this.notation).toBitcoinJS();
        this.divisionFactor = 100000000;

        this.HTTPAPI = new SuperResolver(notation);

        this.getBalance = this.getBalance.bind(this);
        this.waitForConfirmation = this.waitForConfirmation.bind(this);
        this.listenForIncomingTX = this.listenForIncomingTX.bind(this);
        this.generateWallet = this.generateWallet.bind(this);
        this.transfer = this.transfer.bind(this);
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

    getBalance(walletAddress, cb) {
        return this.HTTPAPI.getBalance(walletAddress, cb);
    }


    transfer(transaction, cb) {
        const self = this;
        let debug = true;

        function returnError(message) {
            cb(new Error(message));
            return console.log(message);
        }


        transaction.fee = (transaction.fee || this.fee);
        //convert value to satoshis
        let value = transaction.value;
        this.HTTPAPI.getUTXO(transaction.source.address, (err, outputs) => {
            if (err) {
                console.error("An error occured while transferring from " + transaction.source.address + " to " + transaction.destination + " value:" + value);
                console.error(err);
            }

            if (outputs.length === 0)
                return returnError("Wallet is empty.");

            let netBalance = 0;
            let tx = new bitcoinjs.TransactionBuilder(this.networkInfo);

            if (debug) {
                console.log("Outputs received:");
                console.log(outputs);
            }


            // add each utxo as input.
            outputs.forEach((utxo) => {
                netBalance += utxo.value * 1;
                if (debug)
                    console.log("Added: " + utxo.value + ", Net Balance: " + netBalance + ", TXID:" + utxo.txid + ", Index:" + utxo.index);
                tx.addInput(utxo.txid, utxo.index);
            });

            if (debug)
                console.log({netBalance, value, "fee": transaction.fee});

            // see if balance is upto mark.
            if (netBalance < (value + transaction.fee))
                return returnError("Wallet balance is less than transfer. " + netBalance);


            //if empty wallet flag is true, don't leave anything. Ignore value
            if (transaction.emptyWallet)
                value = netBalance - transaction.fee;

            /**
             * Calculations
             */
            if (self.normalizeToSatoshis(value) === 0)
                return returnError("Trying to send 0 units. Sick!");

            if (debug)
                console.log("Adding output, Destination: " + transaction.destination + ", Value:" + self.normalizeToSatoshis(value));

            tx.addOutput(transaction.destination, self.normalizeToSatoshis(value));

            //check if anything remains after this tx.
            let remaining = netBalance - value - transaction.fee;
            if (remaining > transaction.fee) {
                if (debug)
                    console.log("There is something remaining, adding Destination:" + transaction.source.address + ", Value:" + self.normalizeToSatoshis(remaining));
                tx.addOutput(transaction.source.address, self.normalizeToSatoshis(remaining));
            }


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