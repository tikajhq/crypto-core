#!/usr/bin/env bash

wget https://github.com/monacoinproject/monacoin/releases/download/monacoin-0.15.1/monacoin-0.15.1-x86_64-linux-gnu.tar.gz -O mona.tar.gz
tar -xvzf mona.tar.gz && rm mona.tar.gz && mv monacoin-* mona
