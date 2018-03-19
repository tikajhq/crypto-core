const Currencies = require("./Currencies");
let WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 4101});


wss.on('connection', (ws) => {
    let subscriptionList = {};

    function sendTX(tx, rawtx) {
        send(tx);
    }

    function send(data) {
        try {
            if (arguments.length === 1)
                ws.send(JSON.stringify(data));
            else
                ws.send(JSON.stringify(arguments));
        } catch (e) {
            cleanUP();
        }
    }

    function sendError(message) {
        send({"error": message});
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
                let currency = Currencies.getInstance(message.params.currency);
                if (!currency)
                    return sendError("`currency` instance not present in server.");
                if (['incoming_tx', 'confirmed_tx', 'outgoing_tx','unconfirmed_tx'].indexOf(message.params.event) === -1)
                    return sendError("Unknown event to subscribe to.");

                // manage the subscription list
                subscriptionList[message.params.currency + message.params.event] = {
                    "currency": currency,
                    "event": message.params.event,
                    "listener": sendTX
                };
                //subscribe
                currency.on(message.params.event, sendTX);
                send({result: "binded", to: message.params});

                break;
            default:
                logger.debug("Unknown type.")
        }
    });

    ws.on('disconnect', function () {

    });
});
