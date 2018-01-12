let util = require('util'),
    EventEmitter = require('events').EventEmitter;


class Currency {

    constructor(notation, options) {
        this.notation = notation;
        this.options = options;
    }


}

util.inherits(Currency, EventEmitter);
module.exports = Currency;