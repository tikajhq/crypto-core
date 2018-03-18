#!/usr/bin/env bash

wget https://github.com/digibyte/digibyte/releases/download/v6.14.2/digibyte-6.14.2-x86_64-linux-gnu.tar.gz -O digi.tar.gz
tar -xvzf digi.tar.gz && rm digi.tar.gz && mv digibyte-* digi

#  start service
pm2 start ./digi/bin/digibyted -- -server -rest  -rpcallowip=0.0.0.0/0 -rpcuser=dgb -rpcpassword=s3cur3