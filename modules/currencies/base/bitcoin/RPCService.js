const EventEmitter = require('events');
let bitcoinjs = require('bitcoinjs-lib');
let coininfo = require('coininfo');
let RPCClient = require('./BitcoinRPCClient');
let TransactionDecoder = require('./TransactionDecoder');

//https://github.com/trezor/trezor-common/blob/master/coins.json
//https://github.com/trezor/trezor-core/blob/master/src/apps/common/coins.py

class RPCService extends EventEmitter {
    constructor(config, cb) {
        super();
        this.RPC_RAWTX_USE_JSON = 1;
        this.MIN_CONFIRMATION_COUNT = config.minConfirmations || 6;
        this.CONFIRMATION_REFRESH_INTERVAL = config.confirmationRefreshInterval || 1000 * 60;

        this.currency = config.currency;
        this.divisionFactor = config.divisionFactor || 100000000;
        this.networkInfo = coininfo(this.currency).toBitcoinJS();


        this.coreInfo = null;
        this.newTXService = this.newTXService.bind(this);
        this.confirmationService = this.confirmationService.bind(this);

        // console.log(this.networkInfo.toBitcoinJS());

        this.cacheTXids = [];
        this.addressesToWatch = [];
        this.confirmationTransactionsCache = {};

        this.rpcConfig = config.rpcConfig;
        this.rpc = new RPCClient(this.rpcConfig);
        this.fetchCoreInfo(cb);

    }


    /**
     * Fetch information of core
     * @param cb
     */
    fetchCoreInfo(cb) {
        this.rpc.getNetworkInfo((err, result) => {
            this.coreInfo = result;
            cb(err, result);
        });
    }

    /**
     * Return core information
     * @return {null|*}
     */
    getCoreInfo() {
        return this.coreInfo;
    }


    getCommonAddresses(tx, addresses) {
        //iterate over each output & see if it has monitoring address
        let foundAddresses = [];
        let foundIndex = -1;
        tx.vout.forEach((singleOut) => {
            if (singleOut.addresses && (foundIndex = addresses.indexOf(singleOut.addresses[0])) >= 0)
                foundAddresses.push(addresses[foundIndex])
        });
        return foundAddresses.length || -1;
    }

    /**
     * Add tx to watchlist for confirmations.
     * @param txids
     * @return {number}
     */
    addTXForConfirmation(txids) {
        txids.forEach(txid => {
            this.confirmationTransactionsCache[txid] = new Date();
        });
        return this.confirmationTransactionsCache;
    }

    /**
     * When a new tx is found in blockchain
     * @param tx
     */
    onNewRawTX(tx) {
        this.emit("transaction", tx);
    }

    /**
     * When a tx is confirmed in watchlist.
     * @param tx
     */
    onNewConfirmedTX(tx) {
        this.emit("confirmed", tx);
    }

    /**
     * Fetch transactions by id & decode them.
     * @param txids
     * @param cb
     * @return {*}
     */
    getRawTX(txids, cb) {
        let recievedTXes = [];
        // if list is empty, return blank
        if (!txids || !txids.length)
            return cb(null, recievedTXes);

        // make a batch request to get info of all txs
        this.rpc.batch(() => {
            txids.forEach((txid) => {
                this.rpc.getRawTransaction(txid, this.RPC_RAWTX_USE_JSON);
            });
        }, (err, rawtxs) => {
            if (err) {
                console.error(err);
                console.error("THERE IS SOME CRITICAL ISSUE.");
                return cb(err, recievedTXes)
            }

            rawtxs.forEach((rawtx) => {
                let tx = null;
                if (this.RPC_RAWTX_USE_JSON) {
                    // decode input addresses
                    if (!rawtx.result)
                        return;
                    tx = TransactionDecoder.decodeInputs(rawtx.result, this.networkInfo);
                } else {
                    //decode each raw tx received from batch call.
                    tx = ((new TransactionDecoder(rawtx.result, this.networkInfo)).decode());
                }
                // Don't do additional processing
                // TransactionDecoder.normalize(tx);
                recievedTXes.push(tx);
            });

            cb(null, recievedTXes)
        });

    }


    /**
     * A method when called, keeps checking new transactions, decode them & emit `transaction` event
     */
    newTXService() {
        const self = this;
        //get whatever is in node memory
        self.rpc.getRawMemPool((err, ret) => {
            // console.log("Get raw memory pool.");
            if (err) {
                console.error(err);
                //if error repull after 10s
                return setTimeout(self.newTXService, 10000);
            }

            let toFetch = [];

            //list all new txids
            ret.result.forEach((txid) => {
                if (self.cacheTXids.indexOf(txid) === -1)
                    toFetch.push(txid);
            });

            this.getRawTX(toFetch, (err, rawtxs) => {
                //generate an event
                rawtxs.forEach((tx) => {
                    self.onNewRawTX(tx);
                });
                //set to new block.
                self.cacheTXids = ret.result;
                setTimeout(self.newTXService, 2500);
            })

        });
    }


    /**
     * calls onNewConfirmedTX if any transaction from confirmationTransactionsCache has counts more than MIN_CONFIRMATION_COUNT
     */
    confirmationService() {
        logger.debug("Watching TXIDS for confirmations ");
        logger.debug(Object.keys(this.confirmationTransactionsCache).slice(0, 6));
        this.getRawTX(Object.keys(this.confirmationTransactionsCache), (err, transactions) => {
            transactions.forEach(transaction => {
                //if confirmations more than mincount
                if (transaction.confirmations >= this.MIN_CONFIRMATION_COUNT) {
                    // emit event
                    this.onNewConfirmedTX(transaction);
                    //remove from refresh cache.
                    delete this.confirmationTransactionsCache[transaction.txid]
                }

            });
            //reload the service
            setTimeout(this.confirmationService, this.CONFIRMATION_REFRESH_INTERVAL);
        })
    }

    broadcastTX(txHex, cb) {
        this.rpc.sendRawTransaction(txHex, (error, response) => {
            if (error) console.log(error);
            console.log(response);
            cb(error, response);
        });
    }

    normalizeTX(rawtx) {
        let actualTX = {
            txid: rawtx.txid,
            currency: this.currency,
            timestamp: {
                created: new Date(),
            },
            from: [],
            to: []
        };

        rawtx.vin.forEach((t) => {
            if (t.scriptSig && t.scriptSig.addresses)
                t.scriptSig.addresses.forEach(address => actualTX.from.push(address));
        });

        // actualTX.from = [...new Set(actualTX.from)];

        rawtx.vout.forEach((t) => {
            actualTX.to.push({addresses: t.scriptPubKey.addresses, units: t.value})
        });

        return actualTX;

    }
}


module.exports = RPCService;