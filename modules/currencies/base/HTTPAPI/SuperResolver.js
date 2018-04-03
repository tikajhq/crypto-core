const ChainSo = require("./../HTTPAPI/ChainSo");
const CryptoID = require("./../HTTPAPI/CryptoID");
const HTTPQTUM = require("./../HTTPAPI/HTTPQTUM");
const HTTPXRP = require("./../HTTPAPI/HTTPXRP");
const HTTPMONA = require("./../HTTPAPI/HTTPMONA");
const BlockCypher = require("./../HTTPAPI/BlockCypher");


const AVAILABLE_RESOLVERS = [BlockCypher, CryptoID, HTTPQTUM, HTTPXRP, HTTPMONA, ChainSo];

class SuperResolver {


    constructor(notation, options) {

        options = options || {};
        this.CURRENCY_RESOLVERS = [];
        AVAILABLE_RESOLVERS.forEach((classVal) => {
            //if it is supported
            if (classVal.SUPPORTED_CURRENCIES.indexOf(notation) !== -1)
            //push to resolvers list for current currency.
                this.CURRENCY_RESOLVERS.push(new classVal(notation))
        });

        logger.info("Loaded " + this.CURRENCY_RESOLVERS.length + " resolvers for " + notation);
    }

    ensureResult(method, parameters, callback, resolverIndex) {
        if (typeof resolverIndex === 'undefined')
            resolverIndex = 0;

        let resolverName = (this.CURRENCY_RESOLVERS[resolverIndex].constructor.name);
        logger.debug("Using resolver " + resolverName);
        this.CURRENCY_RESOLVERS[resolverIndex][method](parameters, (err, result) => {
            //if any error
            if (err) {
                //if last resolver
                if (this.CURRENCY_RESOLVERS.length === resolverIndex)
                    return callback(err, result);
                else {
                    //call next resolver
                    logger.debug(resolverName + ": Calling next resolver for " + method + " " + parameters + " " + resolverIndex);
                    return this.ensureResult(method, parameters, callback, resolverIndex + 1);
                }
            }
            return callback(err, result);
        })
    }


    getBalance(address, cb) {
        return this.ensureResult('getBalance', address, (err, balance) => {
            if (err)
                return cb(err);
            cb && cb(null, balance)
        });
    }

    getUTXO(address, cb) {
        return this.ensureResult('getUTXO', address, (err, txes) => {
            if (err)
                return cb(err);
            cb && cb(null, txes)
        });
    }
}

module.exports = SuperResolver;