const forEach = require('mocha-each');
let assert = require('assert');

['xrp', 'doge'].forEach(currency_name => {
    const Currency = require("./" + currency_name);
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
    });
})
