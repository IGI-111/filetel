import P2PT from 'p2pt';
import WebTorrent, { Torrent } from 'webtorrent';
import trackers from './trackers';
import prettyBytes from 'pretty-bytes';

export default class Download {
  public code = undefined;
  public fileName: string;
  private node: P2PT;
  public progress = 0;
  private leecher = new WebTorrent();
  public torrent: Torrent;
  public fileURI = undefined;

  public activate({ path }: { path: string }) {
    this.code = path.trim().replace(/\//gi, ' ').toLowerCase();
    this.setupNode();
  }

  private setupNode() {
    this.node = new P2PT(trackers, `cherami-${this.code}`);
    this.node.on('msg', (_peer, msg) => {
      const { magnet, fileName } = JSON.parse(msg.toString());
      this.fileName = fileName;

      this.leecher.add(magnet, { announce: trackers }, (torrent: Torrent) => {
        this.torrent = torrent;
        torrent.on('download', (_bytes) => {
          this.progress = torrent.progress;
        });

        torrent.on('done', () => {
          torrent.files[0].getBlobURL((_err, url) => {
            this.fileURI = url;
          });
        });
      });
    });
    this.node.start();
  }
  public prettyBytes(bytes: number): string {
    return prettyBytes(bytes);
  }
}
