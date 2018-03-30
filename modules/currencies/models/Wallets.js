const crypto = require('crypto');
const db = global.MongoClient.db(CONFIG.DATABASE_SYSTEM);
let collection = db.collection(CONFIG.WALLETS_COLLECTION);

module.exports = {

    register: (wallet, cb) => {
        if (!wallet.address || !wallet.secret)
            return cb(new Error("Wallet address or secret is not present."));
        if (!wallet.owner)
            return cb(new Error("Owner name should be provided with a wallet."));
        if (!wallet.currency)
            return cb(new Error("Currency is needed  for a registered address, without that we cannot know what it is. "));

        //copy the parameter
        let record = _.clone(wallet);
        record['_id'] = crypto.createHash('md5').update(record.address).digest("hex");
        // add more details.
        record['timestamp'] = {
            "created": +(new Date())
        };

        //insert the record.
        collection.insertOne(wallet, cb);
    },

    unregister: (wallet, cb) => {
        if (!wallet.address && !wallet.id)
            return cb(new Error("Either provide wallet address or wallet id."));
        if (!wallet.owner)
            return cb(new Error("Owner name should be provided with a wallet."));

        let query = {};
        if (wallet.address)
            query['address'] = wallet.address;
        if (wallet.id)
            query['_id'] = wallet.id;

        collection.removeOne(query, cb)
    },

    getAll: (cb) => {
        return this.getBy({}, cb);
    },
    getBy: (filter, columns, cb) => {
        collection.find(filter, columns).toArray((err, wallets) => {
            cb(wallets)
        })
    },

    getWalletsAddress(currency, cb) {
        return this.getBy({currency}, {address: 1}, (list) => {
            cb(list.map((item) => {
                if (item.address)
                    return item.address;
            }));
        })
    },

    setBalance: (address, amount) => {
        collection.updateOne({address: address}, {$set: {"meta.balance": amount}}, {upsert: true});
    },
};
