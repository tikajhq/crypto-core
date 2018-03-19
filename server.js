require("./boot");
let rp = require('request-promise');
let express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
let bodyParser = require('body-parser');

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, client) {
    global.MongoClient = client;
    console.log("Connected correctly to server");
    const db = client.db("tikncc");
    global.DB = db;
    boot();
});

function pollCrons() {
    rp.get(CONFIG.REFRESH_ENDPOINTS, {})
        .then(data => {
            // console.log("DONE");
        }).catch(console.log);
}

setInterval(pollCrons, 1000 * 15);

function boot() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.listen(port);

    console.log('API Server started on: ' + port);

    let Router = require("./modules/currencies/Router");
    const wsAPI = require("./modules/currencies/services/WebsocketAPI");
    const Currencies = require("./modules/currencies/services/Currencies");
    const Rates = require("./modules/currencies/services/RateSync");
    Currencies.init(CONFIG.AVAILABLE_CURRENCIES);
    Rates.init(CONFIG.AVAILABLE_CURRENCIES);

    app.route('/api/currencies/list')
        .get(Router.list_all);

    app.route('/api/currencies/:currency/send').get(Router.send);
    app.route('/api/currencies/:currency/generate_wallet').get(Router.generateWallet);

    app.use(express.static('www'))
}
