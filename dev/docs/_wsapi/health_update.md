---
title: subscribe.health_updates
position: 1.2
type: get
description: Subscribe Health
right_code: |
  ~~~ json
  {
    "type":"subscribe",
    "params":{
      "event":"health_updates",
      "currencies":"*"
    }
  }
  ~~~
  {: title="Request" }
   
   
  ~~~ json
  {
    "result":"binded",
    "to":"btc",
    "event":"health_updates"
  }
  ~~~
  {: title="Response" }
  
  
  ~~~ json
  {
    "currency":"xrp",
    "event":"health_updates",
    "data":{
      "currency":"xrp",
      "status":100,
      "history":[
        7,
        12,
        11
      ]
    }
  }
  ~~~
  {: title="Event" }

  ~~~ json
    {
      "error": "`currency` instance not present in server."
    }

  ~~~
  {: title="Error" }

---

Allows you to regularly receive health updates along with last N processed transactions. 

currency 
: (String) Notation of currency to subscribe event for.
currencies 
: (Array) List of notation of currency to subscribe event for. It can be `*` to include all Available Currencies.
