---
title: /currencies/list 
position: 1.0
type: get
description: List currencies
right_code: |
  ~~~ json
  {
    "data":{
      "btc":{
        "name":"Bitcoin",
        "symbol":"BTC",
        "rates":{
          "tik":"1.0",
          "inr":"540789.4376",
          "usd":"8315.36",
          "btc":"1.0"
        },
        "changes":{
          "h1":"-0.25",
          "h24":"7.47",
          "d7":"-14.16"
        },
        "last_updated":"1521443967",
        "address":"1F2gwhaPYeCWQV8jVpHsVpyuSVaLWEihrd"
      },
      "doge":{
        "name":"Dogecoin",
        "symbol":"DOGE",
        "rates":{
          "tik":"0.00000040",
          "inr":"0.2139449891",
          "usd":"0.00328969",
          "btc":"0.00000040"
        },
        "changes":{
          "h1":"0.21",
          "h24":"3.58",
          "d7":"-20.98"
        },
        "last_updated":"1521443941",
        "address":"D6CmZee6AMV5vxvmocVTqSPwZ3tob7cyNU"
      }
    }
  }
  ~~~
  {: title="Response" }

  ~~~ json
  {
    "error": true,
    "message": "Unknown error."
  }
  ~~~
  {: title="Error" }
---

Object with keys as currencies notations & values as object with address and other info.

currencies
: (Array) Currencies to include.

base
: (String) Currency to consider as base currency.

Above parameters are not supported as of now.
{: .info }