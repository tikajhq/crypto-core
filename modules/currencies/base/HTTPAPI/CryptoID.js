const HTTPAPI = require("./HTTPAPI");

class CryptoID extends HTTPAPI {
    constructor(currency) {
        super(currency, {
            host: "http://chainz.cryptoid.info/",
            endpoints: {
                "summary": "explorer/api.dws?q=summary",
                "get_balance": currency + "/api.dws?q=getbalance&a=[address]",
                "get_received": currency + "/api.dws?q=getreceivedbyaddress&a=[address]",
                "get_unspent": currency + "/api.dws?q=unspent&active=[address]",
            }
        });
        this.endparam = "&key=5ec282d50096"
    }

    getBalance(address, cb) {
        return this.makeAPICall('get_balance', {address}, (err, response) => {
            if (err)
                return cb(err);
            cb(null, response)
        });
    }

    getUTXO(address, cb) {
        return this.makeAPICall('get_unspent', {address}, (err, response) => {
            if (err)
                return cb(err);
            let txs = response.unspent_outputs.map((item) => {
                return {
                    "txid": item.tx_hash,
                    index: item['tx_output_n'] || item['tx_ouput_n'],
                    value: parseFloat(item.value) / CONFIG.SATOSHIS,
                    confirmations: item.confirmations
                }
            });
            cb(null, txs)
        });
    }


}

CryptoID.SUPPORTED_CURRENCIES = ["42", "1337", "2give", "8bit", "abc", "ac", "adc", "aeg", "anc", "arco", "arg", "atms", "atom", "b3", "bash", "bay", "bcc", "bean", "bee2", "bela", "blitz", "blk", "block", "boli", "brit", "bro", "bsd", "bsx", "bta", "btci", "btdx", "btg", "btm", "btx", "bucks", "bxt", "byc", "byz", "bzl", "c2", "cach", "cann", "carbon", "cbx", "ccc", "ccn", "chao", "chbt", "civ", "civ-test", "club", "cnc", "cno", "colx", "cpc", "cqst", "crea", "crypt", "crw", "cure", "dash", "dgb", "dgc", "dime", "dmd", "dmx", "dnr", "dollar", "dope", "dot", "drs", "drz", "dtc", "dvc", "eac", "ebc", "ec", "ecc", "ecn", "efl", "egc", "egcc", "emc2", "emd", "enrg", "ent", "eqt", "erc", "ery", "fail", "flax", "fuel", "funk", "gam", "gap", "gcr", "geo", "glc", "gld", "gre", "grn", "grs", "grs-test", "gun", "hbn", "hxx", "i0c", "icn", "ifc", "imx", "info", "infx", "insn", "ioc", "ion", "ivc", "ixc", "j", "karm", "kblc", "klk", "kobo", "kore", "koruna", "kush", "lana", "lems", "lir", "lol", "loc", "ltc", "lux", "linx", "ltca", "mac", "manna", "max", "maxt", "may", "mbch", "mec", "meow", "mnd", "mojo3", "moon", "mscn", "mst", "mue", "nav", "ned", "neos", "netko", "neva", "nobl", "note", "npc", "nro", "nxx", "oc", "octo", "off", "ok", "opal", "ozc", "pak", "part", "pcn", "pho", "phr", "piggy", "pink", "pivx", "pnd", "poker", "post", "pot", "ppc", "ppc-test", "pr", "ptc", "pura", "put", "pxi", "pwc", "qrk", "rads", "rads-test", "rbc", "rby", "ric", "rly", "rns", "rsgp", "scol", "sfr", "sh", "sha", "skc", "slg", "slr", "smly", "snrg", "spr", "sprts", "spz", "src", "stk", "str", "strat", "strat-test", "stv", "super", "sync", "swift", "swing", "sxc", "sys", "szc", "taj", "talk", "tech", "tes", "tic", "toa", "tpwr", "troll", "trump", "trust", "tx", "tzc", "ubiq", "ufo", "uni", "uno", "usc", "vade", "vash", "vcn", "vgs", "via", "visio", "vivo", "vlx", "vrc", "vrm", "vtc", "vuc", "wac", "wbc", "wc", "wc-old", "wex", "worm", "wsx", "wyv", "ww", "x2c", "xc", "xcs", "xjo", "xlr", "xmg", "xmy", "xp", "xpy", "xqn", "xspec", "xst", "xstc", "xto", "xvp", "xzc", "zeit", "zet", "zoi"];

module.exports = CryptoID;