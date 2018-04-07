https://docs.google.com/document/d/1KVd-2tg-Ze5-b3kFYh1GUdGn9jvoo7HFO3wH_knpd3U/edit


docker run -d --hostname tik.co --restart always --name rabbit -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=themadhurendra -e RABBITMQ_DEFAULT_PASS="s3cur3r@b" -v $(pwd)/rabbitmq:/var/lib/rabbitmq rabbitmq:3-management



- https://github.com/trezor/trezor-common/blob/master/coins.json
- https://github.com/trezor/trezor-core/blob/master/src/apps/common/coins.py
- https://github.com/ShieldCoin/SHIELD-android
- https://github.com/Coinomi/coinomi-android/blob/master/core/src/main/java/com/coinomi/core/coins/
- https://github.com/Coinomi/coinomi-android/blob/master/wallet/src/main/java/com/coinomi/wallet/Constants.java
- https://github.com/guggero/blockchain-demo/blob/master/bitcoin-networks.md
- https://github.com/libbitcoin/libbitcoin/wiki/Altcoin-Version-Mappings
- http://coinofview.com/index.html

## Looking for private, pub keys, message prefix 

https://github.com/bitcoin/bitcoin/blob/master/src/chainparams.cpp
```
base58Prefixes[EXT_PUBLIC_KEY] = {0x04, 0x88, 0xB2, 0x1E};
base58Prefixes[EXT_SECRET_KEY] = {0x04, 0x88, 0xAD, 0xE4};
```

https://github.com/bitcoin/bitcoin/blob/master/src/validation.cpp

```
const std::string strMessageMagic = "Bitcoin Signed Message:\n";
```

### Firewalls in nodes:
```bash
sudo ufw allow from 144.76.110.37 

```