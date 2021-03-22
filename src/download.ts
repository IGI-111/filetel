import P2PT from 'p2pt';
import WebTorrent, { Torrent } from 'webtorrent';
import trackers from './trackers';

export class Download {
  public code = undefined;
  private node: P2PT;
  public fileURI = undefined;
  public progress = 0;
  private leecher = new WebTorrent();

  public activate({ path }: { path: string }) {
    this.code = path.trim().replace(/\//gi, ' ').toLowerCase();
    this.setupNode();
  }

  private setupNode() {
    this.node = new P2PT(trackers, `cherami-${this.code}`);
    this.node.on('msg', (_peer, msg) => {
      const magnet = msg;

      this.leecher.add(magnet, { announce: trackers }, (torrent: Torrent) => {
        torrent.on('download', (_bytes) => {
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
