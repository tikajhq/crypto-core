global.CONFIG = require("./constants");
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

function boot() {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.listen(port);

    console.log('API Server started on: ' + port);

    let Router = require("./modules/currencies/Router");

    app.route('/currencies/list')
        .get(Router.list_all);

    app.route('/currencies/:currency/send').get(Router.send);
    app.route('/currencies/:currency/generateWallet').get(Router.getWallet);
}
