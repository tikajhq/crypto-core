const Currency = require("./../Currency");
let RippleAPI = require('ripple-lib').RippleAPI;

const instructions = {maxLedgerVersionOffset: 5};


class Ripple extends Currency {
    constructor(options, cb) {
        super("xrp", options);
        this.primaryWallet = CONFIG.getDefaultWallet(this.notation);
        this.api = new RippleAPI({
            trace: false,
            server: 'wss://s2.ripple.com:443',// Public rippled server hosted by Ripple, Inc.
            // server: 'ws://127.0.0.1:5006' // Public rippled server hosted by Ripple, Inc.
        });
        this._bootstrap(cb)
    }

    listenForIncomingTX() {
        let watchAddresses = [this.primaryWallet.address];
        //register
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
            if (t.transaction.TransactionType === 'Payment' && t.meta.TransactionResult === 'tesSUCCESS') {
                let tx = t.transaction;
                if (watchAddresses.indexOf(tx.Destination) !== -1) {
                    let newTx = {
                        id: tx.hash,
                        from: tx.Account,
                        amount: parseFloat(tx.Amount) / 100000,
                        to: tx.Destination,
                        currency: this.notation,
                        time: +(new Date())
                    };
                    console.log("============================================");
                    console.log("==========Received XRP =====================");
                    console.log("============================================");
                    console.log(newTx);
                    this.emit("incomingTX", newTx, t);
                }
            }
        });
    }

    _bootstrap(cb) {
        this.api.on('error', (errorCode, errorMessage) => {
            console.log(errorCode + ': ' + errorMessage);
        });
        this.api.on('connected', () => {
            console.log('connected');
        });
        this.api.on('disconnected', (code) => {
            // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
            // will be 1000 if this was normal closure
            console.log('disconnected, code:', code);
        });


        this.api.connect().then(() => {
            cb();
            // this.api.getServerInfo()
        }).catch(console.error);

    }


    generateWallet() {
        //TODO: LOG
        return this.api.generateAddress();
    }

    send(to, value, cb) {
        //TODO: LOG
        return this.transfer(this.primaryWallet, to, value, cb);
    }

    transfer(source, destination, value, cb) {
        //TODO: LOG
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
        console.log(payment);
        this.logTX(payment);
        //TODO: LOG
        return api.preparePayment(source.address, payment, instructions).then(prepared => {
            console.log('Payment transaction prepared...');
            const {signedTransaction} = api.sign(prepared.txJSON, source.secret);
            console.log('Payment transaction signed...');
            //TODO: LOG
            api.submit(signedTransaction).then((message) => {
                cb(null, message);
                //TODO: LOG
            }, (err) => {
                //TODO: LOG
                cb(err, null);
            });
        }).catch((message) => {
            console.log(message)
        });
    }
}

module.exports = Ripple;