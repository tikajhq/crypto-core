let util = require('util'),
    EventEmitter = require('events').EventEmitter;

const HEALTH_CHECK_INTERVAL = 30 * 1000;

class Currency {

    constructor(notation, options) {
        this.notation = notation;
        this.options = options;
        this.ACTUAL_TRANSFER = true;
        this.watchAddresses = {};
        this.tickIncomingCounter = 0;

        this.CurrencyConfig = CONFIG.currencies[notation];
        this.primaryWallet = CONFIG.getDefaultWallet(this.notation);


        logger.info("Initialized instance of " + this.notation);
        setInterval(() => {
            logger.info("[" + this.notation + "] Processed " + this.tickIncomingCounter + " TX.");
            this.tickIncomingCounter = 0;
        }, HEALTH_CHECK_INTERVAL)
    }

    log(message) {
        logger.info(this.notation, " ", message)
    }

    logTx(level, txID, messages) {
        logger.log(level, txID, messages)
    }


    _syncWatchAddressList() {
        //add primary wallet to list.
        this.watchAddresses[this.primaryWallet.address] = 1;
    }

    setWatchAddresses(addressList) {
        this.watchAddresses = {};
        this.addWatchAddresses(addressList);
    }

    addWatchAddresses(addressList) {
        if (typeof addressList === "string")
            addressList = [addressList];
        addressList.forEach((address) => this.watchAddresses[address] = 1);
        this._syncWatchAddressList();
    }

    removeWatchAddress(address) {
        delete this.watchAddresses[address];
        this._syncWatchAddressList();
    }

    /**
     * To be called for unconfirmed transactions.
     */
    onUTXO(tx, rawtx) {
        this.emit("incoming_tx", tx, rawtx);
        this.tickIncomingCounter++;
        if (tx.to) {
            //check for all to
            for (let i = 0; i < tx.to.length; ++i) {
                if (tx.to[i].addresses) {
                    //iterate over each address in addresses
                    //normally it is just 1 address.
                    for (let j = 0; j < tx.to[i].addresses.length; ++j) {
                        //check if it is in watch list or not.
                        if (this.watchAddresses[tx.to[i].addresses[j]])
                            return this.waitForConfirmation(tx, rawtx)
                    }
                }
            }
        }
    }

    waitForConfirmation(tx, rawtx) {
        throw new Error("Method should call onConfirmedTX once tx is confirmed.")
    }

    /**
     * Once transaction is confirmed
     */
    onConfirmedTX(tx, rawtx) {
        this.emit("confirmed_tx", tx, rawtx)
    }

    /**
     * when outgoing transaction is created
     */
    onOutgoingTX(tx, rawtx) {
        this.emit("outgoing_tx", tx, rawtx)
    }

    onWaitingForConfirmation(tx,rawtx){
        this.emit("unconfirmed_tx", tx, rawtx)
    }


    getTransactionID() {
        return Math.random().toString(36).substring(7).toUpperCase();
    }

    send(to, value, cb, tag) {
        logger.info("Send", {to, value, cb, tag});
        return this.transfer({source: this.primaryWallet, destination: to, value, tag}, cb);
    }


    setStatus(status) {
        if (status)
            return logger.info("[" + this.notation + "] UP");
        return logger.info("[" + this.notation + "] DOWN")
    }
}

util.inherits(Currency, EventEmitter);
module.exports = Currency;