import P2PT from 'p2pt';
import trackers from './trackers';
import { randomWords } from './wordlist';

export class Upload {
  public newContent = '';
  public content = undefined;
  private node;
  private sent = false;
  private code = randomWords(4).join(' '); // this should only be the first part of the secret

  public async setContent(newContent: string) {
    this.content = newContent;
    this.setupNode();
  }
  private setupNode() {
    this.node = new P2PT(trackers, `cherami-${this.code}`);
    this.node.on('peerconnect', (peer) => {
      this.sent = true;
      this.node.send(peer, this.content);
    });
    this.node.start();
  }
}
