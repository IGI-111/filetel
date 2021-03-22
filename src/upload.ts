import P2PT from 'p2pt';
import WebTorrent from 'webtorrent';
import trackers from './trackers';
import { randomWords } from './wordlist';
import prettyBytes from 'pretty-bytes';

export class Upload {
  public selectedFiles: FileList;
  public uploadingFiles: FileList;
  private node: P2PT;
  private code = ''; // this should only be the first part of the secret
  private seeder?: WebTorrent.Instance;
  public torrent?: WebTorrent.Torrent;

  public redirectToDownload() {
    this.code = this.code.trim().toLowerCase();
    window.location.href = this.buildLinkHref();
  }

  public upload(selectedFiles: FileList) {
    this.uploadingFiles = selectedFiles;

    this.code = randomWords(5).join(' ');

    this.seeder = new WebTorrent();

    const file = this.uploadingFiles.item(0);
    this.seeder.seed(file, { announce: trackers }, (torrent) => {
      this.torrent = torrent;
      this.node = new P2PT(trackers, `cherami-${this.code}`);
      this.node.on('peerconnect', async (peer) => {
        return this.node.send(peer, torrent.magnetURI);
      });
      this.node.start();
    });
  }
  public buildLinkHref(): string {
    return `${window.location.protocol}${
      window.location.host
    }/#/${this.code.replace(/ /gi, '/')}`;
  }
  public prettyBytes(bytes: number): string {
    return prettyBytes(bytes);
  }
}
