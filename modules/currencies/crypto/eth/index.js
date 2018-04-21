const Web3 = require('web3');
const EthereumWallet = require("ethereumjs-wallet");
const EthereumTx = require('ethereumjs-tx');
const util = require('ethereumjs-util');

const Currency = require("./../../base/Currency");
const WEI = (1000000000 * 1000000000);

class ETH extends Currency {
    constructor(options, cb) {
        super("eth", options);
        this.primaryWallet = CONFIG.getDefaultWallet(this.notation);
        this.web3 = (new Web3("ws://" + this.CurrencyConfig.core_host + ":" + this.CurrencyConfig.core_port));
        this.api = this.web3.eth;

        this._bootstrap(cb);
        this.confirmationQueue = {};
        this.watchConfirmations = this.watchConfirmations.bind(this);
    }

    listenForIncomingTX() {
        let queue = {};

        let subscription = this.api.subscribe('pendingTransactions', (err, transaction) => {
            queue[transaction] = 1;
        });
        //fetch utxos every 2 seconds.
        setInterval(() => {

            this.fetchTXBatch(Object.keys(queue), (data) => {
                if (data)
                //normalize & shoot to UTXO
                    this.onUTXO(this.normalizeTX(data), data);

            });
            queue = {};
        }, 2000);

        //confirmation section.
        this.watchConfirmations();
    }

    fetchTXBatch(transactions, cb) {
        // add all txids to batchlist
        transactions.forEach((txid) => {
            this.api.getTransaction(txid).then((tx) => cb(tx, txid)).catch(cb);
        });
    }

    watchConfirmations() {
        this.fetchTXBatch(Object.keys(this.confirmationQueue), (transaction, txid) => {
            if (transaction.blockHash || transaction.blockNumber) {
                //remove from watchlist
                delete this.confirmationQueue[txid];
                //confirm.
                this.onConfirmedTX(tx, rawtx);
            }

        });
        setTimeout(this.watchConfirmations, 30000)
    }

    normalizeTX(rawtx) {

        //amount: ,
        return {
            currency: this.notation,
            txid: rawtx.hash,
            from: [
                rawtx.from
            ],
            to: [
                {addresses: [rawtx.to], units: parseFloat(rawtx.value) / WEI}
            ],
            fee: rawtx.gas,
            timestamp: {
                created: +(new Date()),
            }
        }
    }

    waitForConfirmation(tx, rawtx) {
        console.log(tx);
        this.onWaitingForConfirmation(tx, rawtx);
        this.confirmationQueue[tx.txid] = 1;
    }

    _bootstrap(cb) {
        this.api.getBlockNumber()
            .then(cb).catch(cb);
    }

    generateWallet() {
        logger.debug("Generating " + this.notation + " wallet");
        let wallet = EthereumWallet.generate();
        return {
            address: wallet.getAddressString(),
            secret: wallet.getPrivateKeyString(),
            key: wallet.getPrivateKey().toString('hex'),
        }
    }

    getBalance(walletAddress, cb) {
        return this.api.getBalance(walletAddress).then(info => {
            cb && cb(null, info)
        }).catch(cb);

    }

    submitRawTransaction(txID, signedTransaction, cb) {
        this.api.sendSignedTransaction(signedTransaction, (err, hash) => {
            if (err) {
                this.logTx("error", txID, err);
                cb && cb(err.message);
            } else {
                this.api.getTransaction(hash).then((tx) => {
                    this.waitForConfirmation(this.normalizeTX(tx), tx);
                }).catch(console.log);
                this.logTx("debug", txID, hash);
                cb && cb(null, {txid: hash});
            }
        });
    }

    transfer(transaction, cb) {
        this.api.getTransactionCount(transaction.source.address)
            .then((txCount) => {
                let txID = this.getTransactionID();

                // console.log(txID);
                this.logTx("info", txID, transaction);

                let api = this.api;

                let value = transaction.value * WEI;
                // console.log(value);
                let payment = {
                    nonce: this.web3.utils.toHex(txCount),
                    gasPrice: this.web3.utils.toHex(20000000000),
                    gasLimit: this.web3.utils.toHex(this.getFee(transaction) * WEI),
                    to: transaction.destination,
                    value: this.web3.utils.toHex(value),
                    data: '0xc0de'
                };

                const tx = new EthereumTx(payment);
                this.logTx("debug", txID, payment);

                //sign the transaction.
                const privateKey = util.toBuffer(transaction.source.secret);
                tx.sign(privateKey);
                const serializedTx = '0x' + tx.serialize().toString('hex');


                // console.log(serializedTx);
                // cb(null,serializedTx);
                return this.submitRawTransaction(txID, serializedTx, cb)
                // return api.preparePayment(transaction.source.address, payment, instructions).then(prepared => {
                //     // Sign the transaction with user's key.
                //     const {signedTransaction} = api.sign(prepared.txJSON, );
                //
                //     this.logTx("debug", txID, 'Payment transaction signed, submitting it.');
                //
                //     //submit the transaction.
                //     return this.submitRawTransaction(txID, signedTransaction, cb);
                // }).catch((err) => {
                //     this.logTx("error", txID, err);
                //     cb(err, null);
                // });
            }).catch(cb);

    }
}

module.exports = ETH;