import P2PT from 'p2pt';
import WebTorrent from 'webtorrent';
import trackers from './trackers';
import { randomWords } from './wordlist';

export class Upload {
  public selectedFiles: FileList;
  private uploadingFiles: FileList;
  private node;
  private code = randomWords(4).join(' '); // this should only be the first part of the secret

  public upload(selectedFiles: FileList) {
    this.uploadingFiles = selectedFiles;

    const file = this.uploadingFiles.item(0);

    const seeder = new WebTorrent();

    seeder.seed(file, undefined, (torrent) => {
      this.node = new P2PT(trackers, `cherami-${this.code}`);
      this.node.on('peerconnect', (peer) => {
        this.node.send(peer, torrent.magnetURI);
      });
      this.node.start();
    });
  }
}
