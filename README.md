# file.tel
<!-- TODO: phone logo -->
*Simple and secure peer-to-peer file transfer*

Send files securely and quickly directly from one machine to others using a small webpage and a few words.

## How it works

* We generate two random secrets encoded in unambiguous and easy to pronounce words
* Both sides of the transfer use websocket trackers to find each other based on the first secret and open a WebRTC connection
* We use the second secret and the connection to derive a strong shared key using SPAKE2
* We transfer the files encrypted with the shared key using webtorrent

## Inspired by

* Magic Wormhole
* FilePizza
* instant.io
* P2PT
* webtorrent
