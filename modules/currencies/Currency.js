let util = require('util'),
    EventEmitter = require('events').EventEmitter;


class Currency {

    constructor(notation, options) {
        this.notation = notation;
        this.options = options;
    }

    logTX(tx) {
        DB.collection('outgoingtx').insert({tx, timestamp: +(new Date())});
    }

}

util.inherits(Currency, EventEmitter);
module.exports = Currency;