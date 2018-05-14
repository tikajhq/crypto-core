require("../../../boot");
let assert = require('assert');
let expect = require("chai").expect;
let fs = require("fs");
let path = require("path");

let output =
    "---\n" +
    "title: Currencies\n" +
    "description: Enabled Currencies\n" +
    "position: 5\n" +
    "---\n" +
    "\n" +
    "| Notation | Fees    | \n" +
    "|------|-------------|\n";


function toFixed(x) {
    if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        let e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
    return x;
}

(CONFIG.AVAILABLE_CURRENCIES).forEach((supportedCurrency) => {
    let currency = CONFIG.currencies[supportedCurrency];
    output +=
        "| " + supportedCurrency + " | "
        + (currency.fees.map(fee => {
            return toFixed(fee)
        }).join("<br/>")) + " |\n";


    describe('#' + supportedCurrency, function () {

        it('should have fees', function () {
            assert(currency.fees.length > 0);
        });

        it('should have atleast one wallet', function () {
            assert(currency.wallets.length > 0);
        });

        it('should have valid primaryWallet', function () {
            expect(currency.primaryWallet).to.be.within(0, currency.wallets.length - 1);
        });

    });
});

after((done) => {
    fs.writeFile(path.resolve(__dirname + "/../../../dev/docs/_documentation/5_currencies.md"), output, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("=======================");
            console.log("Currencies.md updated.");
            console.log("=======================");
        }
        done();
    });

});