const INSIGHTAPI = require("./INSIGHTAPI");

class HTTPMONA extends INSIGHTAPI {
    constructor(currency) {
        super(currency, "https://mona.insight.monaco-ex.org/insight-api-monacoin/");
    }
}

HTTPMONA.SUPPORTED_CURRENCIES = ["mona"];

module.exports = HTTPMONA;