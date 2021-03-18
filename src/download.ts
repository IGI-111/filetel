import P2PT from 'p2pt';
import WebTorrent from 'webtorrent';
import trackers from './trackers';

export class Download {
  public newCode = '';
  public code = undefined;
  private node;
  public fileURI = undefined;
  public progress = 0;
  private leecher = new WebTorrent();

  public setCode(newCode: string) {
    this.code = newCode;
    this.setupNode();
  }
  private setupNode() {
    this.node = new P2PT(trackers, `cherami-${this.code}`);
    this.node.on('msg', (peer, msg) => {
      const magnet = msg;

      this.leecher.add(magnet, (torrent) => {
        torrent.on('download', (bytes) => {
          this.progress = torrent.progress;
        });

        torrent.on('done', () => {
          torrent.files[0].getBlobURL((err, url) => {
            this.fileURI = url;
          });
        });
      });
    });
    this.node.start();
  }
}
