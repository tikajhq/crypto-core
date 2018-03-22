#!/usr/bin/env bash
wget https://github.com/dogecoin/dogecoin/releases/download/v1.10.0/dogecoin-1.10.0-linux64.tar.gz -O doge.tar.gz
tar -xvzf doge.tar.gz
rm doge.tar.gz
mv dogecoin-* doge
mkdir -p ~/.dogecoin
wget https://bootstrap.chain.so/bootstrap.dat -O ~/.dogecoin/bootstrap.dat
cp dogecoin.conf ~/.dogecoin/
