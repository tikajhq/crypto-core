const db = global.MongoClient.db("tikcc");

let collection = db.collection('wallets');

module.exports = {
    getAll: (cb) => {
        return this.getBy({}, cb);
    },
    getBy: (filter, cb) => {
        collection.find(filter).toArray((err, wallets) => {
            cb(wallets)
        })
    },

    setBalance: (address, amount) => {
        collection.updateOne({address: address}, {$set: {"meta.balance": amount}}, {upsert: true});
    },

    addTXCache: (txs, cb) => {
        let toLook = txs.map(i => i._id);

        global.DB.collection("rawtx").find({"_id": {"$in": toLook}}, {"_id": 1}).toArray((err, ids) => {
            let exist = ids.map(i => i._id);
            let notExist = [];

            toLook.forEach((id, index) => {
                if (exist.indexOf(id) === -1)
                    notExist.push(txs[index])
            });
            cb(notExist);
            if (notExist.length) {
                global.DB.collection("rawtx").insertMany(txs, {ordered: false}, () => {
                })
            }
        })

    }
};
