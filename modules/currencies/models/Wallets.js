const db = global.MongoClient.db(CONFIG.DATABASE_USER);
let collection = db.collection(CONFIG.WALLETS_COLLECTION);

module.exports = {
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
