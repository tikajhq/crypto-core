#!/usr/bin/env bash

wget https://downloads.getmonero.org/cli/linux64 -O xmr.tar.bz2
tar -xvjf xmr.tar.bz2 && rm xmr.tar.bz2 && mv monero-* xmr

#  start service
pm2 start ./xmr/monerod -- --rpc-bind-ip=0.0.0.0 --confirm-external-bind --rpc-login=xmr:s3cur3
