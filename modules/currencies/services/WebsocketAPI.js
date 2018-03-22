const Currencies = require("./Currencies");
let WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 4101});


function getCurrencies(message, sendError) {
    let notations = [];
    if (message.params.currency)
        notations.push(message.params.currency);
    else
        notations = message.params.currencies;

    if (notations === "*")
        notations = CONFIG.AVAILABLE_CURRENCIES;

    return notations.map((currencyName) => {
        let currency = Currencies.getInstance(currencyName);
        if (!currency) {
            sendError("`currency` instance not present in server for " + currencyName + ".");
            return;
        }
        return currency
    });
}


wss.on('connection', (ws) => {
    let subscriptionList = {};
    function send(data) {
        try {
            if (arguments.length === 1)
                ws.send(JSON.stringify(data));
            else
                ws.send(JSON.stringify(arguments));
        } catch (e) {
            console.log(e);
            cleanUP();
        }
    }

    function sendError(message) {
        send({"error": message});
        return false;
    }

    function cleanUP() {
        logger.debug("Removing listeners");
        Object.keys(subscriptionList).forEach((index) => {
            logger.debug("Removing listener " + index);
            let subscription = subscriptionList[index];
            subscription.currency.removeListener(subscription.event, subscription.listener);
        })
    }


    ws.on('message', (message) => {
        // console.log(message);
        let currencies = false;
        try {
            message = JSON.parse(message);

        } catch (e) {
            console.log(e);
            message = null;
        }
        if (!message)
            return sendError("not a valid message.");

        if (!message.type)
            return sendError("type is needed.");

        if (!message.params)
            return sendError("params is needed.");


        switch (message.type) {
            case "subscribe":

                if ((currencies = getCurrencies(message, sendError)).length === 0)
                    return;
                currencies.forEach((currency) => {
                    if (['incoming_tx', 'confirmed_tx', 'outgoing_tx', 'unconfirmed_tx', "health_updates"].indexOf(message.params.event) === -1)
                        return sendError("Unknown event to subscribe to.");

                    // manage the subscription list
                    let key = currency.notation + message.params.event;
                    subscriptionList[key] = {
                        "currency": currency,
                        "event": message.params.event,
                        "listener": (data) => {
                            send({
                                "currency": currency.notation,
                                "event": message.params.event,
                                "data": data
                            })
                        }
                    };
                    //subscribe
                    currency.on(message.params.event, subscriptionList[key].listener);
                    send({result: "binded", to: currency.notation, "event": message.params.event});
                });
                break;
            default:
                logger.debug("Unknown type.")
        }
    });

    ws.on('disconnect', function () {

    });
});
