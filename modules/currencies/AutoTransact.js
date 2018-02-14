const CS = require("./CurrencyService");

function processWallet(wallet) {
    if (wallet.currency !== "xrp")
        return;
    // let currency = CS.getInstance(wallet.currency);
    // currency.getBalance(wallet.address,(err,balance)=>{
    //     console.log(balance);
    //     currency.getFrom({
    //         address:wallet.address,
    //         secret:wallet.secret
    //     },balance,(err,result)=>{
    //         console.log(result)
    //     })
    // })
}

function transferToAdmin() {
    const db = global.MongoClient.db("tikcc");
    db.collection('wallets').find({}).toArray((err, wallets) => {
        wallets.forEach((wallet) => {
            processWallet(wallet);
        });
    });
}

setTimeout(transferToAdmin, 5 * 1000);
// setInterval(transferToAdmin, 10 * 1000);