---
title: unsubscribe
position: 1.1
type: get
description: Unsubscribe
right_code: |
  ~~~ json
  {
    "type" : "unsubscribe",
    "params" : {
    }
  }
  ~~~
  {: title="Request" }
   
   
  ~~~ json
  {
    "result": "unsubscribed"
  }
  ~~~
  {: title="Response" }
  
  
  ~~~ json
    {
      "error": "`currency` instance not present in server."
    }

  ~~~
  {: title="Error" }
---

Unsubscribe from all events.