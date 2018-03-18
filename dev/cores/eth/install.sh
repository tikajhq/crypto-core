#!/usr/bin/env bash
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum -y

# start service
pm2 start geth -- --rpc --rpcaddr=0.0.0.0 --rpcport=8545 --ws --wsaddr=0.0.0.0 --wsport=8546