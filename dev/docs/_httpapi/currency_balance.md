---
title: /currencies/:currency/get_balance
position: 1.3
type: get
description: Get Balance
right_code: |
  ~~~ json
  {
    "data":1
  }
  ~~~
  {: title="Response" }

  ~~~ json
    {
     "error": "error in getting balance."
    }
  ~~~
  {: title="Error" }
---

Provides method to get balance of a wallet.

address 
: (String) Address of wallet to get balance of.
