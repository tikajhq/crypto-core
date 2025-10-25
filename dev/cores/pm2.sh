#!/usr/bin/env bash
pm2 start --no-autorestart bitcoind               -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=btc
pm2 start --no-autorestart qtumd                  -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=qtum
pm2 start --no-autorestart ./dash/bin/dashd       -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=dash
pm2 start --no-autorestart ./ltc/bin/litecoind    -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=ltc
pm2 start --no-autorestart ./nmc/bin/namecoind    -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=nmc
pm2 start --no-autorestart ./mona/bin/monacoind   -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=mona
pm2 start --no-autorestart ./doge/bin/dogecoind   -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=doge
pm2 start --no-autorestart ./vtc/vertcoind        -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=vtc
pm2 start --no-autorestart ./blk/src/blackcoind   -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=blk
pm2 start --no-autorestart ./dcr/dcrd             -- --notls --txindex  --rpclisten=127.0.0.1 --rpcpass=[REDACTED] --rpcuser=dcr

pm2 start --no-autorestart ./ppc/bin/64/peercoind -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=ppc
pm2 start --no-autorestart ./nvc/gcc-6.2.0/novacoind -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=nvc
pm2 start --no-autorestart ./digi/bin/digibyted   -- -server -printtoconsole -rest -txindex=1  -rpcallowip=0.0.0.0/0 -rpcpassword=[REDACTED] -rpcuser=dgb -rpcport=14022


# pm2 start --no-autorestart ./xmr/monerod        -- --rpc-bind-ip=0.0.0.0 --confirm-external-bind



pm2 start --no-autorestart geth                 --  --rpc --rpcaddr=0.0.0.0 --rpcport=8545  --rpccorsdomain="*" --ws --wsaddr=0.0.0.0 --wsport=8546 --wsorigins "*"
