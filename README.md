![](https://raw.githubusercontent.com/IGI-111/filetel/master/public/logo.png)

*Simple and secure peer-to-peer file transfer*
# file.tel

<a href="https://xkcd.com/949/"><img src="http://imgs.xkcd.com/comics/file_transfer.png" alt="XKCD 949" width="25%" align="right" /></a>

Send files securely and quickly directly from one machine to others using a small webpage and a few words.

[file.tel](https://file.tel) allows you to create an ephemeral and easy to type link to transfer files securely from one machine to the other without having to upload them anywhere.

## How it works

* We generate two random secrets encoded in unambiguous and easy to pronounce words
* Both sides of the transfer use Webtorrent websocket trackers to find each other based on the first secret and open a WebRTC connection
* We use the second secret and the connection to derive a strong shared key using SPAKE2
* We transfer the files encrypted with the shared key using webtorrent

## Inspired by

* [Magic Wormhole](https://github.com/magic-wormhole/magic-wormhole)
* [FilePizza](https://github.com/kern/filepizza)
* [instant.io](https://instant.io)
* [P2PT](https://instant.io)
* [WebTorrent](https://github.com/webtorrent/webtorrent/)
