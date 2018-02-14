let request = require('request');
const Currency = require("./../Currency");
let coinInfo = require('coininfo');
let CoinKey = require('coinkey');
let bitcoinjs = require('bitcoinjs-lib');
let RPCClient = require('bitcoind-rpc');
let Wallets = require('./../Wallets');
let txDecoder = require('./../txdecoder');

//https://sipacoin.com/price/satoshi/inr
let netInfoCoinKey = coinInfo('BTC').versions;

class RPCService {
    constructor(currency, onNewTX) {
        this.currency = currency || "btc";
        this.divisionFactor = 100000000;
        this.netInfobitcoinJS = coinInfo.bitcoin.main.toBitcoinJS();

        this.config = {
            protocol: 'http',
            user: 'user',
            pass: 'pass',
            host: '127.0.0.1',
            port: '8332',
        };

        this.primaryWallet = CONFIG.getDefaultWallet(this.currency);
        this.rpc = new RPCClient(this.config);

        this.txids = [];
        this.addressesToWatch = [];
        this.onNewTXEvent = onNewTX;
        this.fetchNewTransactions = this.fetchNewTransactions.bind(this);
    }

    updateWalletsList(cb) {
        const self = this;
        Wallets.getBy({"currency": self.currency}, (list) => {
            let newAddressesToWatch = [self.primaryWallet.address];
            list.forEach((item) => {
                if (item.address)
                    newAddressesToWatch.push(item.address)
            });
            self.addressesToWatch = newAddressesToWatch;
            cb && cb();
        })
    }

    makeAPICall(endpoint, cb) {
        if (endpoint.indexOf("?") === -1)
            endpoint += "?";
        const url = 'https://blockchain.info/' + endpoint + '&format=json';
        request(url, function (error, response, body) {
            if (error) {
                return cb(error);
            }
            if (response.statusCode !== 200) {
                return cb(response.statusCode);
            }
            cb(null, JSON.parse(body))
        })
    }

    resyncBalance(address, cb) {
        const self = this;
        console.log("Resysncing balance of " + address);
        self.makeAPICall('address/' + address, (err, account) => {
            let netBalance = account.final_balance;
            let txs = account.txs;

            cb && cb(null, account);
            if (txs) {
                Wallets.addTXCache(txs.map((item) => {
                    let outVal = {};
                    item.out.forEach((tx) => {
                        if (tx.addr === address)
                            outVal = tx
                    });
                    return {
                        //incase a block is shared by multiple addresses in system.
                        _id: item.hash + "_" + address,
                        currency: "btc",
                        address: address,
                        units: outVal.value,
                        meta: {
                            raw: item
                        }
                    }
                }), (notExist) => {
                    console.log("Non Existing:", JSON.stringify(notExist));
                    // let inserted = result.insertedIds
                    notExist.forEach((tx) => {
                        self.onNewTX(tx);
                    })
                });
                Wallets.setBalance(address, netBalance / self.divisionFactor);
            }
        });
    }

    getBalance(address, cb) {
        const self = this;
        self.makeAPICall('address/' + address, (err, account) => {
            if (err)
                return cb(err);
            cb(null, account.final_balance)
        });
    }

    getUTXO(address, cb) {
        const self = this;
        this.makeAPICall("unspent?active=" + address, (err, resp) => {
            if (resp && resp['unspent_outputs'])
                cb(null, resp.unspent_outputs);
            else
                cb(null, []);
        });
    }

    /**
     * New tx in API
     * @param tx
     */
    onNewTX(tx) {
        const self = this;
        let toAddress = tx.address;
        let rawTX = tx.meta.raw;
        let hasSameInput = false;
        //check if input has something from same wallet or not.
        rawTX.inputs.forEach((input) => {
            if (input.prev_out.addr === toAddress)
                hasSameInput = true
        });

        console.log(JSON.stringify(tx));
        if (hasSameInput) {
            return console.log("Transactions is probably done from same source, not considering as received.");
        }

        if (rawTX.inputs.length && rawTX.out.length) {
            let isOneInput = true;

            rawTX.inputs.forEach((oneInput) => {
                if (oneInput.prev_out.addr !== rawTX.inputs[0].prev_out.addr)
                    isOneInput = false;
            });

            if (!isOneInput)
                return console.log("TX has multiple inputs, cannot handle it.");


            this.onNewTXEvent({
                id: rawTX.hash,
                from: rawTX.inputs[0].prev_out.addr,
                amount: parseFloat(tx.units) / this.divisionFactor,
                to: tx.address,
                currency: this.currency,
                time: +(new Date())
            }, rawTX)
        }
        //if server address
        //&& input length is 1
        //output length is 1
        //shoot it
    }

    /**
     * When a new tx is found in blockchain
     * This is only for notification for resyncing using API
     * @param tx
     */
    onNewRawTX(tx) {
        const self = this;
        let foundIndex = -1;
        //iterate over each output & see if it has monitoring address
        tx.outputs.forEach((singleOut) => {
            if (singleOut.scriptPubKey.addresses.length && (foundIndex = self.addressesToWatch.indexOf(singleOut.scriptPubKey.addresses[0])) >= 0) {
                self.resyncBalance(self.addressesToWatch[foundIndex])
            }
        })
    }

    fetchNewTransactions() {
        const self = this;
        self.updateWalletsList(() => {
            //get whatever is in node memory
            self.rpc.getRawMemPool((err, ret) => {
                if (err) {
                    console.error(err);
                    //if error repull after 10s
                    return setTimeout(self.fetchNewTransactions, 10000);
                }

                //function to produce batch call for all tx in a block
                function batchCall() {
                    let i = 0;
                    ret.result.forEach((txid) => {
                        if (self.txids.indexOf(txid) === -1) {
                            self.rpc.getRawTransaction(txid);
                            ++i
                        }
                    });
                    // console.log("[BTC] " + (new Date()) + "  Fetching " + i + " TX, Watching " + self.addressesToWatch.length + " wallets.");
                }

                //make a batch request to get info of all txs
                self.rpc.batch(batchCall, (err, rawtxs) => {
                    if (err) {
                        console.error(err);
                        return setTimeout(self.fetchNewTransactions, 10000);
                    }

                    rawtxs.map(function (rawtx) {
                        //decode each tx received from batch call.
                        let tx = ((new txDecoder(rawtx.result, self.netInfobitcoinJS)).decode());
                        //make a callback to process each tx.
                        self.onNewRawTX(tx);
                    });

                    //set to new block.
                    self.txids = ret.result;
                    setTimeout(self.fetchNewTransactions, 2500);
                });
            });
        });
    }
}

class Bitcoin extends Currency {
    constructor(options, cb) {
        super("btc", options);
        this.primaryWallet = CONFIG.getDefaultWallet(this.notation);
        this.api = new RPCService(this.notation, (tx, raw) => {
            if (tx.to !== this.primaryWallet.address) {
                console.log("Empty the wallet: " + tx.to);
                Wallets.getBy({"address": tx.to}, (wallets) => {
                    if (wallets.length) {
                        this.emptyWallet(wallets[0], (err, status) => {
                            console.log("Autotx Done ", err, status);
                        })
                    } else {
                        console.log("Wallet key is not found for " + tx.to)
                    }
                });

            }
            this.emit("incomingTX", tx, raw)
        });
        this._bootstrap(cb);
        this.fee = 20000;
        this.divisionFactor = 100000000;
        this.emptiedRecently = {};
    }

    listenForIncomingTX() {
        console.log("[BTC] Listen for incoming TX");
        this.api.fetchNewTransactions();
        this.api.resyncBalance(this.primaryWallet.address);
    }

    _bootstrap(cb) {
        setTimeout(() => {

            cb();
        }, 1000);
    }

    generateWallet() {
        let ck = new CoinKey.createRandom(netInfoCoinKey);
        return {
            address: ck.publicAddress,
            secret: ck.privateWif,
            key: ck.privateKey.toString('hex'),
        }
    }

    getFrom(from, value, cb) {
        return this.transfer(from, this.primaryWallet.address, value - this.fee, cb);
    }

    send(to, value, cb) {
        return this.transfer(this.primaryWallet, to, value, cb);
    }


    getBalance(walletAddress, cb) {
        return this.api.getBalance(walletAddress, (err, balance) => {
            cb(err, balance)
        })
    }

    emptyWallet(wallet, cb) {
        //1 min
        let EXPIRY_TIME = 60 * 1000;
        /* ms */

        if (typeof this.emptiedRecently[wallet.address] !== "undefined" && (((new Date()) - this.emptiedRecently[wallet.address]) <= EXPIRY_TIME))
            return cb("Already emptied recently.");

        this.emptiedRecently[wallet.address] = new Date();
        return this.api.getBalance(wallet.address, (err, balance) => {
            console.log("Transferring to empty the wallet " + wallet.address + " amount:" + balance);
            this.transfer(wallet, this.primaryWallet.address, (balance - this.fee) / this.divisionFactor, cb);

        })
    }

    transfer(source, destination, value, cb) {
        const self = this;
        //convert value to satoshis
        value = value * self.divisionFactor;
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

//
// let instance = new Bitcoin({}, () => {
//     let divisionFactor = 100000000;
//     instance.send("1E1jjWbsjn3AjPSKHKXwJd2ByojnXg8X47",0.01*divisionFactor,(err,result)=>{
//
//     });
// });
module.exports = Bitcoin;