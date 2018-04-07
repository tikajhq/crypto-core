---
title: HTTP API
description: HTTP API
position: 2
right_code: |
  ~~~ javascript
  $.get("http://cc.tik.co/api/", { "token": "YOUR_APP_KEY"}, function(data) {
    alert(data);
  });
  ~~~
  {: title="jQuery" }

  ~~~ bash
  curl http://cc.tik.co/api/?token=YOUR_APP_KEY
  ~~~
  {: title="Curl" }

---

Normal non-realtime data can be requested using HTTP API's. These request should not be heavy as they may timeout after certain period. 

A simple way to api is provided in Right Pane.



Prefix all HTTP endpoints with root point, Example: if root point is `https://cc.tik.co/api` and endpoint is `/currencies/list`, then full url will be `https://cc.tik.co/api/currencies/list    
{: .warning }

