#!/usr/bin/env bash


SERVER_ADDRESS="10.8.0.7"


test_rpc(){
    curl --data-binary '{"jsonrpc":"1.0","id":"curltext","method":"getnetworkinfo","params":[]}' -H 'content-type:text/plain;' $1
}

print_message(){
    CURRENCY="$1"
    echo "================================"
    echo "Testing $CURRENCY"
    echo "================================"
}

test_blockchain(){
    USERNAME="$1"
    PASSWORD="[REDACTED]"
    PORT="$2"
    CURRENCY="$3"
    print_message "$CURRENCY"
    echo "> Testing REST"
    curl "$SERVER_ADDRESS:$PORT/rest/chaininfo.json"
    echo "> Testing RPC"
    test_rpc "http://$USERNAME:$PASSWORD@$SERVER_ADDRESS:$PORT/"
}

test_blockchain "btc" "8332" "Bitcoin"
test_blockchain "dash" "9998" "DASH"
test_blockchain "doge" "22555" "DOGE"
test_blockchain "qtum" "3889" "QTUM"
test_blockchain "eth" "8545" "Etherium"
test_blockchain "xrp" "5005" "Ripple"
