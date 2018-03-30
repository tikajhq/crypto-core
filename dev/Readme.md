https://docs.google.com/document/d/1KVd-2tg-Ze5-b3kFYh1GUdGn9jvoo7HFO3wH_knpd3U/edit


docker run -d --hostname tik.co --restart always --name rabbit -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=themadhurendra -e RABBITMQ_DEFAULT_PASS="s3cur3r@b" -v $(pwd)/rabbitmq:/var/lib/rabbitmq rabbitmq:3-management



- https://github.com/trezor/trezor-common/blob/master/coins.json
- https://github.com/trezor/trezor-core/blob/master/src/apps/common/coins.py
- https://github.com/ShieldCoin/SHIELD-android
- https://github.com/Coinomi/coinomi-android/blob/master/core/src/main/java/com/coinomi/core/coins/
- https://github.com/Coinomi/coinomi-android/blob/master/wallet/src/main/java/com/coinomi/wallet/Constants.java



### Firewalls in nodes:
```bash
sudo ufw allow from 144.76.110.37 

```