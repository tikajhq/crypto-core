#!/usr/bin/env bash


wget https://github.com/decred/decred-binaries/releases/download/v1.1.2/decred-linux-amd64-v1.1.2.tar.gz -O dcr.tar.gz
tar -xvzf dcr.tar.gz && rm dcr.tar.gz && mv decred-* dcr



#wget https://github.com/decred/decred-release/releases/download/v1.1.2/dcrinstall-linux-386-v1.1.2 -O dcrinstall
#chmod +x dcrinstall && ./dcrinstall