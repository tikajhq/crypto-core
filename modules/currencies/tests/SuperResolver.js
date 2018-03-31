LOG_LEVEL = "debug";
require("../../../boot");
global['CORRUPT_BLOCKCYPHER'] = true;

const forEach = require('mocha-each');
let assert = require('assert');
let expect = require("chai").expect;


const HTTPAPI = require("./../base/HTTPAPI/SuperResolver");

(CONFIG.AVAILABLE_CURRENCIES).forEach((supportedCurrency) => {

    // if(supportedCurrency!=="dash")
    //     return

    let api = null;
    before(() => {
        api = new HTTPAPI(supportedCurrency);
    });


    describe("Currency " + supportedCurrency.toUpperCase(), () => {
        let wallet = CONFIG.getDefaultWallet(supportedCurrency);

        it("getBalance", (done) => {

            api.getBalance(wallet.address, (err, balance) => {
                console.log("Balance in " + wallet.address + " is " + balance);
                assert(err === null);
                assert(balance >= 0);
                done()
            })
        });
        it("getUTXO", (done) => {
            api.getUTXO(wallet.address, (err, balance) => {
                console.log("UTXO in " + wallet.address + " is " + JSON.stringify(balance));
                assert(err === null);
                expect(balance).to.be.an('array');
                done()
            })
        })

    });
});
