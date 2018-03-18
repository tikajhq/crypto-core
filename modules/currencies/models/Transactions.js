const db = global.MongoClient.db(CONFIG.DATABASE_SYSTEM);

let collection = db.collection(CONFIG.RAW_TX_COLLECTION);

module.exports = {
    getAll: (cb) => {
        return this.getBy({}, cb);
    },
    getBy: (filter, columns, cb) => {
        collection.find(filter, columns).toArray((err, wallets) => {
            cb(wallets)
        })
    },
    addTXCache: (txs, cb) => {
        let toLook = txs.map(i => i._id);
        collection.find({"_id": {"$in": toLook}}, {"_id": 1}).toArray((err, ids) => {
            let exist = ids.map(i => i._id);
            let notExist = [];

            toLook.forEach((id, index) => {
                if (exist.indexOf(id) === -1)
                    notExist.push(txs[index])
            });
            cb(notExist);
            if (notExist.length) {
                collection.insertMany(txs, {ordered: false}, () => {
                })
            }
        })

    }
};
