const Currency = require("./../../base/Currency");
let RippleAPI = require('ripple-lib').RippleAPI;
const instructions = {maxLedgerVersionOffset: 5};

class Ripple extends Currency {
    constructor(options, cb) {
        super("xrp", options);
        this.primaryWallet = CONFIG.getDefaultWallet(this.notation);
        this.api = new RippleAPI({
            trace: false,
            // server: 'wss://s2.ripple.com:443',
            server: 'ws://10.8.0.7:5006'
        });
        this._bootstrap(cb)
    }

    listenForIncomingTX() {
        //Subscribe
        this.api.connection._ws.send(JSON.stringify({
            "id": 2,
            "command": "subscribe",
            "streams": [
                "transactions",
                // "ledger",
                // "accounts"
            ]
        }));

        //on new received.
        this.api.connection.on('transaction', (t) => {
            //only successful payments
            //NOTE: this only adds confirmed transactions to UTXO list, hence they are autoconfirmed
            if (t.transaction.TransactionType === 'Payment' && t.meta.TransactionResult === 'tesSUCCESS') {
                this.onUTXO(this.normalizeTX(t.transaction), t.transaction);
            }
        });
    }

    normalizeTX(rawtx) {
        //amount: parseFloat(rawtx.Amount) / 1000000,
        return {
            currency: this.notation,
            txid: rawtx.hash,
            from: [
                rawtx.Account
            ],
            to: [
                {address: [rawtx.Destination], units: rawtx.Amount}
            ],
            timestamp: {
                created: +(new Date()),
            },
            tag: rawtx.DestinationTag
        }
    }

    waitForConfirmation(tx, rawtx) {
        this.onWaitingForConfirmation(tx,rawtx);
        return this.onConfirmedTX(tx, rawtx);
    }

    _bootstrap(cb) {
        this.api.on('error', (errorCode, errorMessage) => {
            this.log(errorCode + ': ' + errorMessage);
            this.setStatus(0);
        });
        this.api.on('connected', () => {
            this.log('connected');
            this.setStatus(1);
        });
        this.api.on('disconnected', (code) => {
            // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
            // will be 1000 if this was normal closure
            this.log('disconnected, code:', code);
            setTimeout(() => {
                //try to reconnect
                this.api.connect();
            }, 1000);
            this.setStatus(0);
        });

        this.api.connect().then(() => {
            cb();
            // this.api.getServerInfo()
        }).catch(console.error);
    }

    generateWallet() {
        logger.debug("Generating " + this.notation + " wallet");
        return this.api.generateAddress();
    }

    getBalance(walletAddress, cb) {
        return this.api.getAccountInfo(walletAddress).then(info => {
            cb(null, info.xrpBalance)
        }).catch(cb);

    }

    submitRawTransaction(txID, signedTransaction) {
        this.api.submit(signedTransaction).then((message) => {
            cb(null, message);
            this.logTx("debug", txID, message);
        });
    }

    transfer(source, destination, value, cb, tag) {
        let txID = this.getTransactionID();

        this.logTx("info", txID, {form: source.address, destination, value, tag});

        let api = this.api;

        value = "" + value;
        const payment = {
            source: {
                address: source.address,
                maxAmount: {
                    value: value,
                    currency: 'XRP'
                }
            },
            destination: {
                address: destination,
                amount: {
                    value: value,
                    currency: 'XRP'
                }
            }
        };
        if (tag)
            payment.destination['tag'] = tag.match(/\d+/g).map(Number);

        this.logTx("debug", txID, payment);
        return api.preparePayment(source.address, payment, instructions).then(prepared => {
            // Sign the transaction with user's key.
            const {signedTransaction} = api.sign(prepared.txJSON, source.secret);

            this.logTx("debug", txID, 'Payment transaction signed, submitting it.');

            //submit the transaction.
            return this.submitRawTransaction(signedTransaction);
        }).catch((err) => {
            this.logTx("error", txID, err);
            cb(err, null);
        });
    }
}

module.exports = Ripple;