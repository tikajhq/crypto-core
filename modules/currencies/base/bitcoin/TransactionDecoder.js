let bitcoin = require('bitcoinjs-lib');

let decodeFormat = function (tx) {
    let result = {
        txid: tx.getId(),
        version: tx.version,
        locktime: tx.locktime,
    };
    return result;
};

let decodeInput = function (tx, network) {
    let result = [];
    tx.ins.forEach(function (input, n) {
        let vin = {
            txid: input.hash.reverse().toString('hex'),
            n: input.index,
            sequence: input.sequence,

            scriptSig: {
                asm: bitcoin.script.toASM(input.script),
                hex: input.script.toString("hex"),
                type: bitcoin.script.classifyInput(input.script),
                addresses: [],
            }
        };
        let chunksIn;
        switch (vin.scriptSig.type) {
            case 'pubkeyhash':
                // P2PKH
                chunksIn = bitcoin.script.decompile(input.script);
                vin.scriptSig.addresses.push(bitcoin.address.toBase58Check(bitcoin.crypto.hash160(chunksIn[chunksIn.length - 1]), network.pubKeyHash));
                break;
            case 'scripthash':
                chunksIn = bitcoin.script.decompile(input.script);
                vin.scriptSig.addresses.push(bitcoin.address.toBase58Check(bitcoin.crypto.hash160(chunksIn[chunksIn.length - 1]), network.scriptHash));
                break;
        }
        result.push(vin);
    });
    return result
};

let decodeOutput = function (tx, network) {

    let format = function (out, n, network) {
        let vout = {
            value: (1e-8 * out.value).toFixed(8),
            n: n,
            valueSat: out.value,
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
                vout.scriptPubKey.addresses.push((bitcoin.address.fromOutputScript(out.script, network)));
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
    this.inputs = decodeInput(this.tx, network);
    this.outputs = decodeOutput(this.tx, network);
};

TxDecoder.prototype.decode = function () {
    let result = {};
    let self = this;
    Object.keys(self.format).forEach(function (key) {
        result[key] = self.format[key]
    });
    result.vin = self.inputs;
    result.vout = self.outputs;
    return result;
};


/**
 * Decode Inputs Address from already decoded transaction.
 * @param tx
 * @param network
 * @return {*}
 */
TxDecoder.decodeInputs = function (tx, network) {
    tx.vin.map(function (input, n) {
        input.scriptSig.addresses = [];
        let script = bitcoin.script.decompile(new Buffer(input.scriptSig.hex, 'hex'));
        input.scriptSig.type = bitcoin.script.classifyInput(script);
        let chunksIn;
        switch (input.scriptSig.type) {
            case 'pubkeyhash':
                // P2PKH
                chunksIn = bitcoin.script.decompile(script);
                input.scriptSig.addresses.push(bitcoin.address.toBase58Check(bitcoin.crypto.hash160(chunksIn[chunksIn.length - 1]), network.pubKeyHash));
                break;
            case 'scripthash':
                chunksIn = bitcoin.script.decompile(script);
                input.scriptSig.addresses.push(bitcoin.address.toBase58Check(bitcoin.crypto.hash160(chunksIn[chunksIn.length - 1]), network.scriptHash));
                break;
        }
        return input;
    });
    return tx;
};

/**
 * Merges addresses from inputs & outputs, along with moving them to parent node.
 * @param tx
 * @return {*}
 */
TxDecoder.normalize = function (tx) {
    let allAddresses = [];
    tx.vin.forEach(value => {

        value['addresses'] = value.scriptSig.addresses || [];
        delete value.scriptSig.addresses;
        value['addresses'].forEach(address => {
            allAddresses.push(address)
        });
        return value;
    });
    tx.vout.forEach(value => {
        value['addresses'] = value.scriptPubKey.addresses || [];
        delete value.scriptPubKey.addresses;
        value['addresses'].forEach(address => {
            allAddresses.push(address)
        });
        return value;
    });

    tx['addresses'] = allAddresses;
    return tx;
};