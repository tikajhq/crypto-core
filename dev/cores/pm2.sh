#!/usr/bin/env bash
pm2 start --no-autorestart bitcoind             -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=btc
pm2 start --no-autorestart qtumd                -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=qtum
pm2 start --no-autorestart ./dash/bin/dashd     -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=dash
pm2 start --no-autorestart ./ltc/bin/litecoind  -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=ltc
pm2 start --no-autorestart ./digi/bin/digibyted -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=dgb -rpcport=14022
pm2 start --no-autorestart ./doge/bin/dogecoind -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=s3cur3 -rpcuser=doge

pm2 start --no-autorestart ./xmr/monerod        -- --rpc-bind-ip=0.0.0.0 --confirm-external-bind --rpc-login=xmr:s3cur3
pm2 start --no-autorestart geth                 -- --cache=2048 --rpc --rpcaddr=0.0.0.0 --rpcport=8545 --ws --wsaddr=0.0.0.0 --wsport=8546 --wsorigins "*"