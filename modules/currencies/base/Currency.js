let util = require('util'),
    EventEmitter = require('events').EventEmitter;


const HEALTH_CHECK_INTERVAL = 30 * 1000;

/**
 * Format of a TX
 * {
 *  txid:"",
 *  currency:"",
 *  timestamp:{
 *   created:"",
 *  }
 *  from:[
 *   { address:"", units:"" }
 *  ],
 *  to:[
 *  { address:"",units:""}
 *  ]
 *
 * }
 */

class Currency {

    constructor(notation, options) {
        this.notation = notation;
        this.options = options;
        this.ACTUAL_TRANSFER = true;
        this.watchAddressesObject = {};
        this.watchAddresses = [];
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
        this.watchAddressesObject[this.primaryWallet] = 1;
        this.watchAddresses = Object.keys(this.watchAddressesObject);
    }

    setWatchAddresses(addressList) {
        this.watchAddressesObject = {};
        this.addWatchAddresses(addressList);
    }

    addWatchAddresses(addressList) {
        if (typeof addressList === "string")
            addressList = [addressList];
        addressList.forEach((address) => this.watchAddressesObject[address] = 1);
        this._syncWatchAddressList();
    }

    removeWatchAddress(address) {
        delete this.watchAddressesObject[address];
        this._syncWatchAddressList();
    }

    /**
     * To be called for unconfirmed transactions.
     * @param tx
     */
    onUTXO(tx, rawtx) {
        this.emit("incoming_tx", tx, rawtx);
        this.tickIncomingCounter++;
    }

    waitForConfirmation(tx, rawtx) {
        throw new Error("Method should call onConfirmedTX once tx is confirmed.")
    }

    /**
     * Once transaction is confirmed
     * @param tx
     */
    onConfirmedTX(tx, rawtx) {
        this.emit("confirmed_tx", tx, rawtx)
    }

    /**
     * when outgoing transaction is created
     * @param tx
     */
    onOutgoingTX(tx, rawtx) {
        this.emit("outgoing_tx", tx, rawtx)
    }


    getTransactionID() {
        return Math.random().toString(36).substring(7).toUpperCase();
    }

    send(to, value, cb, tag) {
        logger.info("Send", {to, value, cb, tag});
        return this.transfer(this.primaryWallet, to, value, cb, tag);
    }


    setStatus(status) {
        if (status)
            return logger.info("[" + this.notation + "] UP");
        return logger.info("[" + this.notation + "] DOWN")
    }
}

util.inherits(Currency, EventEmitter);
module.exports = Currency;