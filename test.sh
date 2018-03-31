#!/bin/bash

test(){
  NAME=$1
  mocha ./modules/currencies/tests/$NAME.js -vv --timeout=20000 --reporter mochawesome --reporter-options reportDir=dev/docs/tests/$NAME,reportFilename=index
}
test SuperResolver
test Currencies
test HTTPAPIs
