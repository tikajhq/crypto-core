const INSIGHTAPI = require("./INSIGHTAPI");

class HTTPQTUM extends INSIGHTAPI {
    constructor(currency) {
        super(currency, "https://explorer.qtum.org/insight-api/");
    }
}
HTTPQTUM.SUPPORTED_CURRENCIES = ["qtum"];

module.exports = HTTPQTUM;