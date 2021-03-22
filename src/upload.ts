import P2PT from 'p2pt';
import WebTorrent from 'webtorrent';
import trackers from './trackers';
import { randomWords } from './wordlist';

export class Upload {
  public selectedFiles: FileList;
  private uploadingFiles: FileList;
  private node: P2PT;
  private code = randomWords(4).join(' '); // this should only be the first part of the secret

  public upload(selectedFiles: FileList) {
    this.uploadingFiles = selectedFiles;

    const file = this.uploadingFiles.item(0);

    const seeder = new WebTorrent();

    seeder.seed(file, { announce: trackers }, (torrent) => {
      this.node = new P2PT(trackers, `cherami-${this.code}`);
      this.node.on('peerconnect', async (peer) => {
        return this.node.send(peer, torrent.magnetURI);
      });
      this.node.start();
    });
  }
  public buildLinkHref(): string {
    return `${window.location.host}/#/${this.code.replace(/ /gi, '/')}`;
  }
}
