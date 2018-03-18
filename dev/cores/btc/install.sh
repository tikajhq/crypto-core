#!/usr/bin/env bash
sudo add-apt-repository ppa:bitcoin/bitcoin
sudo apt-get update
sudo apt-get install bitcoind -y
pm2 start bitcoind -- -server -rest  -rpcallowip=0.0.0.0/0 -rpcuser=btc -rpcpassword=s3cur3