LOG_LEVEL = "info";
require("../../../boot");


const forEach = require('mocha-each');
let assert = require('assert');
let expect = require("chai").expect;


(["ChainSo", 'CryptoID', "HTTPQTUM", "BlockCypher", "HTTPMONA"]).forEach(name => {
    const HTTPAPI = require("./../base/HTTPAPI/" + name);

    describe('# ' + name, function () {
        describe("ClassTest", () => {
            it('should have SUPPORTED_CURRENCIES', () => {
                assert(HTTPAPI.SUPPORTED_CURRENCIES.length > 0);
            });
        });

        describe("InstanceTest", () => {
            (HTTPAPI.SUPPORTED_CURRENCIES).forEach((supportedCurrency) => {
                if (CONFIG.AVAILABLE_CURRENCIES.indexOf(supportedCurrency) >= 0) {

                    let api = null;
                    before(() => {
                        api = new HTTPAPI(supportedCurrency);
                    });


                    describe("Testing currency " + supportedCurrency, () => {
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
                }
            });

        });
    });

    // it('should generate random.', function () {
    //     let testWal = crypt.generateWallet();
    //     assert(testWal.address !== wallet.address);
    //     assert(testWal.secret !== wallet.secret);
    // });

});
