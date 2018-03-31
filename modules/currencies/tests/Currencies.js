LOG_LEVEL = "debug";
require("../../../boot");

const forEach = require('mocha-each');
let assert = require('assert');

["btc", "xrp", "dash", "doge", "qtum", "dgb", "ltc"].forEach(currency_name => {
    const Currency = require("./../crypto/" + currency_name);
    describe(currency_name, function () {
        describe('#generateWallet', function () {
            let crypt = new Currency();
            console.log("\n");
            console.log("Notation: " + crypt.notation);
            console.log("Generating wallet...");
            let wallet = crypt.generateWallet();
            console.log("Address : " + wallet.address);
            console.log("Secret  : " + wallet.secret);

            it('should generate valid address & secret', function () {
                assert(wallet.address.length > 0);
                assert(wallet.secret.length > 0)
            });
            it('should generate random.', function () {
                let testWal = crypt.generateWallet();
                assert(testWal.address !== wallet.address);
                assert(testWal.secret !== wallet.secret);
            });

        });

        // describe("Should have valid networkInfo");
        // describe("Should have 0 send validation.");
        // describe("wait for confirmation"); //take an incoming tx, add to list, wait for confirmation.


    });
});


after((done) => {
    //auto exit after 10secs once tests is finished
    setTimeout(() => {
        process.exit(0)
    }, 10000);
    //done is called so that other hooks are executed. 10s is provided to them !
    done();
});