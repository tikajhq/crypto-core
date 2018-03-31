const fs = require("fs");

module.exports = {

    getConfig: (config) => {
        let CORE_SERVER_1 = config.server_1 || "10.8.0.31";
        let conf = {
            AVAILABLE_CURRENCIES: ["btc", "xrp", "dash", "doge", "qtum", "dgb", "ltc"],
            NODE_SERVER: "c1.tik.co",
            NODE_VHOST: "/crypto",

            DATABASE_SYSTEM: "tikncc",
            RAW_TX_COLLECTION: "rawtx",
            DATABASE_USER: "tikcc",
            WALLETS_COLLECTION: "wallets",
            SATOSHIS: 100000000,

            TX_ENDPOINT: "https://portal.blockage.io/api/add_transaction?",
            REFRESH_ENDPOINTS: "http://portal.blockage.io/Api/cron_refresh",

            currencies: {
                xrp: {
                    core_host: CORE_SERVER_1,
                    core_port: 5006,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "rP2D9UygcwjmoX196ZtgYQNZKx1D6CEq8S",
                        },
                        {
                            address: "rnWrJU52Zkjc83FHSyY2dDkFgVZg9izuRc",
                        }
                    ]
                },
                btc: {
                    core_host: CORE_SERVER_1,
                    core_port: 8332,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "1F2gwhaPYeCWQV8jVpHsVpyuSVaLWEihrd",
                        },
                        {
                            address: "1E1jjWbsjn3AjPSKHKXwJd2ByojnXg8X47",
                        }
                    ]
                },
                doge: {
                    core_host: CORE_SERVER_1,
                    core_port: 22555,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "D6CmZee6AMV5vxvmocVTqSPwZ3tob7cyNU",
                        },
                        {
                            address: "DNqBwVmj4eoHPQfNun9Gh9FSTjuS7dFHLA",
                        }
                    ]
                },
                dash: {
                    core_host: CORE_SERVER_1,
                    core_port: 9998,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "XmLiiUxL7LqDNusXPuKxTdW4b495QhPeGU",
                        },
                        {
                            address: "Xtz51kFsgCdVs4VKd9QymeXyqnSPzs7ZXr",
                        }
                    ]
                },
                qtum: {
                    core_host: CORE_SERVER_1,
                    core_port: 3889,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "QfRecS1JK6i1QgF5wDEpGSYePedVVk2U8H",
                        },
                        {
                            address: "QS3JCnVbUwbx9qH7eeUmYbsAARNaHdZWcp",
                        }
                    ]
                },

                dgb: {
                    core_host: CORE_SERVER_1,
                    core_port: 14022,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "DEM4xWxcUEJ5av6FtSvGGLoZfNbkPk8DPb",
                        }, {
                            address: "DR29dBfzArVxhdTphfV7D2eNKShiHXrpYP",
                        }
                    ]
                },
                eth: {
                    core_host: CORE_SERVER_1,
                    core_port: 8332,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "",

                        },
                        {
                            address: "",

                        }
                    ]
                },
                ltc: {
                    core_host: CORE_SERVER_1,
                    core_port: 9332,
                    primaryWallet: 0,
                    wallets: [
                        {
                            address: "LMCxC3RX9rHmSqWp1G9dRRjyZM4iNWdzg2",
                        },
                        {
                            address: "LNqNpTLGRQzcNvy3bbgycWsvk5edwrW3c8",
                        }
                    ]
                },
                // tik:{
                //     core: CORE_SERVER,
                //     primaryWallet: 0,
                //     wallets: [
                //         {
                //             address: "",
                //             
                //         },
                //         {
                //             address: "",
                //             
                //         }
                //     ]
                // }
            },

            getDefaultWallet(currency) {
                if (this.currencies[currency] && this.currencies[currency].wallets.length)
                    return this.currencies[currency].wallets[this.currencies[currency].primaryWallet];
                return null
            }
        };

        if (fs.existsSync(__dirname + "/secrets.js")) {
            let secrets = require("./secrets");
            console.log("Found Secrets file. Loaded private keys.");
            Object.keys(conf.currencies).forEach((value) => {
                conf.currencies[value]['wallets'].forEach((wallet, index) => {
                    if (secrets[wallet.address])
                        conf.currencies[value]['wallets'][index]['secret'] = secrets[wallet.address];
                });
            });
        } else {
            console.log("[WARNING] Secrets file is not found, real transaction won't be possible.");
        }

        console.log(JSON.stringify(conf.currencies));
        return conf;
    }
};