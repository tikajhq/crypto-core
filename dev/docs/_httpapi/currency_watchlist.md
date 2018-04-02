---
title: /currencies/:currency/watchlist
position: 1.4
type: get
description: Watchlist
right_code: |
  ~~~ json
  {
    "data": {
        "DEM4xWxcUEJ5av6FtSvGGLoZfNbkPk8DPb": 1,
        "DR29dBfzArVxhdTphfV7D2eNKShiHXrpYP": 1,
        "DAuHXUpbkwytNkKpL26xH2WxSbMrEjECYa": 1,
        "D6ohCWPqUrFif3T3dDWHMrJX64z4FcqTiZ": 1,
        "DHw8CKAvw65tBo3SKwe2BQugsfDk224Prd": 1
    }
  }
  ~~~
  {: title="Response" }

  ~~~ json
    {
     "error": "Unsupported currency requested."
    }
  ~~~
  {: title="Error" }
---

Provides method to get list of addresses being watched,


sync 
: (Boolean)  if true, Update the list of addresses from database
