let util = require('util'),
    EventEmitter = require('events').EventEmitter;


class Currency {

    constructor(notation, options) {
        this.notation = notation;
        this.options = options;
        this.ACTUAL_TRANSFER = false;
        console.log("Initialized instance of " + this.notation);
    }

    log(message) {
        console.log(this.notation, " ", message)
    }
    logTX(tx) {
        DB.collection('outgoingtx').insertOne({tx, timestamp: +(new Date())});
    }

}

util.inherits(Currency, EventEmitter);
module.exports = Currency;