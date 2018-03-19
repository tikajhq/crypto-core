---
title: Websocket API
description: Websocket API
position: 10.1
right_code: |
  ~~~ javascript
    var ws = new WebSocket('ws://api.cc.cal.tik.co:4101');
  
    function send(type, params) {
      return ws.send(JSON.stringify({type: type, params: params}))
    }
    
    // event emmited when connected
    ws.onopen = function () {
      console.log('websocket is connected ...');
      // sending a send event to websocket server
    
    };
    
    var $container = $("#container");
    // event emmited when receiving message
    ws.onmessage = function (ev) {
      console.log(JSON.parse(ev.data));
    };

    //your code here
    send("subscribe", {"event": "incoming_tx", "currency": "doge"});
  ~~~
  {: title="Javascript" }


---


Connect to Websocket API for realtime communication. All methods can be accessed/performed using `send` method. 

Errors etc are reported by sending a message. 

