---
title: /currencies/:currency/send
position: 1.1
type: get
description: Send currencies
right_code: |
  ~~~ json
  {
    "data":{
      
    }
  }
  ~~~
  {: title="Response" }

  ~~~ json
    {
     "error": "`amount` is missing."
    }
  ~~~
  {: title="Error" }
---

Provides method to send certain amount from core to different addresses.

to 
: (String) Address of wallet to transfer funds to.

amount 
: (Float) Units of currencies to be transferred. Can be in decimal.
