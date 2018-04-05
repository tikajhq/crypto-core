const INSIGHTAPI = require("./INSIGHTAPI");

class HTTPMONA extends INSIGHTAPI {
    constructor(currency) {
        super(currency, "https://mona.chainsight.info/api/");
    }
}

HTTPMONA.SUPPORTED_CURRENCIES = ["mona"];

module.exports = HTTPMONA;