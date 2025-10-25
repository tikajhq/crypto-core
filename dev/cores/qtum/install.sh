#!/usr/bin/env bash
sudo su
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys BF5B197D
echo "deb http://repo.qtum.info/apt/ubuntu/ xenial main" >> /etc/apt/sources.list
sudo apt update && sudo apt install qtum -y


#pm2 start qtumd -- -server -rest -txindex=1 -rpcallowip=0.0.0.0/0 -rpcuser=qtum -rpcpassword=[REDACTED] -printtoconsole