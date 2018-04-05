const Wallets = require("../models/Wallets");

function emptyWallet(currencyInstance, address, cb) {
    if (['btc', 'doge', 'dash', 'qtum', "dgb", "ltc", "mona", "vtc"].indexOf(currencyInstance.notation) === -1)
        return cb(new Error("Not in list of currencies which can be auto emptied."));

    Wallets.getBy({address}, {}, (wallets) => {
        if (wallets.length) {
            currencyInstance.transfer({
                source: wallets[0],
                destination: currencyInstance.primaryWallet.address,
                emptyWallet: true
            }, (err, status) => {
                console.log("Autotx Done.");
                cb(err, status);
            })
        } else {
            cb(new Error("Wallet key is not found for " + address));
        }
    });
}

module.exports = {
    processTX: (currencyInstance, tx) => {
        let index = 0;
        tx.to.forEach(singleTX => {
            if (!singleTX.addresses)
                return;
            if ((index = singleTX.addresses.indexOf(currencyInstance.primaryWallet.address)) === -1) {

                singleTX.addresses.forEach(address => {
                    emptyWallet(currencyInstance, address, (err, status) => {
                        console.log(index, address);
                        if (err)
                            return console.log(err.message);
                        console.log(err, status);
                    });
                });
            }
        });
    }
};