#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install yum-utils alien -y
sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm
yumdownloader --enablerepo=ripple-stable --releasever=el7 rippled
sudo rpm --import https://mirrors.ripple.com/rpm/RPM-GPG-KEY-ripple-release && rpm -K rippled*.rpm
sudo alien -i --scripts rippled*.rpm && rm rippled*.rpm

cp rippled.cfg /opt/ripple/etc/rippled.cfg
sudo systemctl enable rippled.service
sudo systemctl start rippled.service