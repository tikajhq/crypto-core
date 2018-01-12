global.CONFIG = require("./constants");
let XRP = require("./modules/currencies/xrp");


let xrp = new XRP({}, () => {
    let toWallet = CONFIG.currencies.xrp.wallets[1].address;
    console.log(toWallet);
    xrp.listenForIncomingTX();
    // xrp.send(toWallet,0.001);
});

xrp.on("incomingTX", (tx, raw) => {
    console.log(tx);
});


