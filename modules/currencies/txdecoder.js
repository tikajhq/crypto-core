let bitcoin = require('bitcoinjs-lib');

let decodeFormat = function (tx) {
    let result = {
        txid: tx.getId(),
        version: tx.version,
        locktime: tx.locktime,
    };
    return result;
};

let decodeInput = function (tx) {
    let result = [];
    tx.ins.forEach(function (input, n) {
        let vin = {
            txid: input.hash.reverse().toString('hex'),
            n: input.index,
            script: bitcoin.script.toASM(input.script),
            sequence: input.sequence,
        };
        result.push(vin);
    });
    return result
};

let decodeOutput = function (tx, network) {

    let format = function (out, n, network) {
        let vout = {
            satoshi: out.value,
            value: (1e-8 * out.value).toFixed(8),
            n: n,
            scriptPubKey: {
                asm: bitcoin.script.toASM(out.script),
                hex: out.script.toString('hex'),
                type: bitcoin.script.classifyOutput(out.script),
                addresses: [],
            },
        };
        switch (vout.scriptPubKey.type) {
            case 'pubkeyhash':
            case 'scripthash':
                vout.scriptPubKey.addresses.push(bitcoin.address.fromOutputScript(out.script, network));
                break;
        }
        return vout
    };

    let result = [];
    tx.outs.forEach(function (out, n) {
        result.push(format(out, n, network));
    });
    return result
};


let TxDecoder = module.exports = function (rawtx, network) {
    this.tx = bitcoin.Transaction.fromHex(rawtx);
    this.network = network;
    this.format = decodeFormat(this.tx);
    this.inputs = decodeInput(this.tx);
    this.outputs = decodeOutput(this.tx, network);
};

TxDecoder.prototype.decode = function () {
    let result = {};
    let self = this;
    Object.keys(self.format).forEach(function (key) {
        result[key] = self.format[key]
    });
    result.inputs = self.inputs;
    result.outputs = self.outputs;
    return result;
};
