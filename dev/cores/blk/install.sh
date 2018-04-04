#!/bin/bash

sudo apt-get install build-essential libssl-dev libdb-dev libdb++-dev libboost-all-dev git -y
sudo apt-get install libminiupnpc-dev -y # For UPNP support. You can also set USE_UPNP=0
sudo apt-get install libqrencode-dev -y # Or set USE_QRCODE=0
sudo apt-get install libqt4-dev libminiupnpc-dev

git clone https://github.com/CoinBlack/blackcoin.git blk
cd blk/src/
make -f makefile.unix
cd ../../
