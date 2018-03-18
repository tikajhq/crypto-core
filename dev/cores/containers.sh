#!/usr/bin/env bash
cd docker/ripple
docker run --restart=unless-stopped --name xripple -p 5006:5006 -d -v $(pwd)/rippled.conf:/etc/rippled.conf gatehub/rippled --conf /etc/rippled.conf
cd ..

# doge
cd docker/doge
docker build -t dogecoind:v1 .
docker run -d --name=dogecoind-data dogecoind:v1 bash
docker run -d --restart=unless-stopped --name=dogecoind -p 22555:22555 --volumes-from=dogecoind-data dogecoind:v1 dogecoind
curl --user user:pass --data-binary '{"jsonrpc": "1.0", "id":"0", "method": "getinfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:22555/
cd ..


docker run -d --rm  -p 8332:8332 ruimarinho/bitcoin-core -printtoconsole -server -rest -regtest=1 -rpcport=8332 -rpcallowip=0.0.0.0/0  -rpcpassword=pass -rpcuser=user