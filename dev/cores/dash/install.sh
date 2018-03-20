#!/usr/bin/env bash

wget https://github.com/dashpay/dash/releases/download/v0.12.2.3/dashcore-0.12.2.3-linux64.tar.gz -O dash.tar.gz
tar -xvzf dash.tar.gz
rm dash.tar.gz
mv dashcore-* dash
