#!/usr/bin/env bash
sudo apt-get install git software-properties-common python-software-properties npm nodejs nodejs-legacy screen vim htop iotop bmon nethogs -y
sudo npm -g install n pm2 yarn mocha bower
sudo n stable

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
sudo apt-get install -y mongodb-org