![](https://raw.githubusercontent.com/IGI-111/filetel/master/static/logo.png)

*Simple and secure peer-to-peer file transfer*
# file.tel

Send files securely and quickly directly from one machine to others using a small webpage and a few words.

[file.tel](file.tel) allows you to create an ephemeral and easy to type link to transfer files securely from one machine to the other without having to upload them anywhere.


<div>
<a href="https://xkcd.com/949/"><img src="http://imgs.xkcd.com/comics/file_transfer.png" alt="XKCD 949" width="30%" align="right" /></a>

Sending files from one computer to the other should be trivial now that we have an Internet, yet it isn't.
There have been many attempts to solve this problem, I try here to combine the best of all of them
in terms of security and user experience in one simple public webpage with an easy to remember mnemonic.
</div>


## How it works

* We generate two random secrets encoded in unambiguous and easy to pronounce words
* Both sides of the transfer use Webtorrent websocket trackers to find each other based on the first secret and open a WebRTC connection
* We use the second secret and the connection to derive a strong shared key using SPAKE2
* We transfer the files encrypted with the shared key using webtorrent

## Inspired by

* Magic Wormhole
* FilePizza
* instant.io
* P2PT
* webtorrent
