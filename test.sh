#!/bin/bash

test(){
  NAME=$1
  # start corrupt
  CORRUPT=1 mocha ./modules/currencies/tests/$NAME.js -vv --timeout=20000 --reporter mochawesome --reporter-options reportDir=dev/docs/tests/,reportFilename=$NAME
  sleep 2
}

test ConfigChecks
test HTTPAPIs
test Currencies
test SuperResolver

