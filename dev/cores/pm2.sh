#!/usr/bin/env bash
pm2 start --no-autorestart bitcoind             -- -server -printtoconsole -rest -reindex -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=btc
pm2 start --no-autorestart qtumd                -- -server -printtoconsole -rest -reindex -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=qtum
pm2 start --no-autorestart ./dash/bin/dashd     -- -server -printtoconsole -rest -reindex -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=dash
pm2 start --no-autorestart ./digi/bin/digibyted -- -server -printtoconsole -rest -reindex -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=digi -rpcport=14022
pm2 start --no-autorestart ./doge/bin/dogecoind -- -server -printtoconsole -rest -reindex -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=doge
pm2 start --no-autorestart ./xmr/monerod        -- -server --rpc-bind-ip=0.0.0.0 --confirm-external-bind --rpc-login=xmr:s3cur3
