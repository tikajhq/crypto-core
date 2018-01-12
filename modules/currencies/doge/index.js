const Currency = require("./../Currency");

let CoinKey = require('coinkey');
let coinInfo = require('coininfo');

let dogeInfo = coinInfo('DOGE').versions;

class Doge extends Currency {
    constructor() {
        super("doge");

    }

    generateWallet() {
        let ck = new CoinKey.createRandom(dogeInfo);
        return {
            address: ck.publicAddress,
            secret: ck.privateWif,
            key: ck.privateKey.toString('hex'),
        }

    }
}


module.exports = Doge;