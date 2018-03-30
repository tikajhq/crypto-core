---
title: /currencies/:currency/generate_wallet
position: 1.2
type: get
description: Generate Wallet
right_code: |
  ~~~ json
  {
    "data": {
      "secret": "snqUwLxaz2ex11X2FUhek6nFjLryX",
      "address": "r4DuKiRD83W2gJLJMCMokXfDKAFnCfRxmf"
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

Wallet with <code>address</code> and <code>secret</code>.

save 
: (Boolean) Set it to anything, if true wallet will be securely saved in database. No `secret` or `key` is returned.
