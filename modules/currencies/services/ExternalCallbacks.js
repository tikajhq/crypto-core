const rp = require("request-promise");
let ExternalCallbacks = {

    onNewTx: function (tx, raw,type) {
        global.DB.collection('incomingtx').insertOne({tx, raw});

        let url = CONFIG.TX_ENDPOINT + "txid=" + tx.txid +"&type="+ type + "&currency=" + tx.currency + "&from=" + tx.from.join(";");

        let tourl = tx.to.map(to=>{
            if(to.addresses)
                return to.addresses.join(",")+":"+to.units
        }).join(";");

        url+="&to="+tourl;

        if (tx['tag'])
            url += "&tag=" + tx.tag;

        console.log(url);
        rp.post(url, {
            form: {
                tx: JSON.stringify(tx),
                rawtx: JSON.stringify(raw),
                type:type
            }
        }).then(data => {
            console.log(data);
        }).catch((err) => {
            console.log(err.message)
        });
    },
};

module.exports = ExternalCallbacks;