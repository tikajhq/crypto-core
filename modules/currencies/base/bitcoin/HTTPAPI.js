const request = require("request");

class HTTPAPI {
    constructor(notation, config) {
        this.APIHost = config.host || 'https://blockchain.info/';
        this.endpoints = config.endpoints;
        this.endparam = config.endparam || "";
    }

    makeAPICall(endpoint, params, cb) {
        let endpointURL = this.endpoints[endpoint];

        Object.keys(params).forEach((key) => {
            endpointURL = endpointURL.replace(new RegExp("\\[" + key + "\\]", "g"), params[key])
        });

        const url = this.APIHost + endpointURL + this.endparam;
        logger.debug(url);
        request(url, function (error, response, body) {
            if (error) {
                return cb(error);
            }
            if (response.statusCode !== 200) {
                return cb(response.statusCode);
            }
            cb(null, JSON.parse(body))
        })
    }
}

module.exports = HTTPAPI;