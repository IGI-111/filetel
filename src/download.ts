import P2PT from 'p2pt';
import trackers from './trackers';

export class Download {
  public newCode = '';
  public code = undefined;
  private node;
  public content = undefined;

  public setCode(newCode: string) {
    this.code = newCode;
    this.setupNode();
  }
  private setupNode() {
    this.node = new P2PT(trackers, `cherami-${this.code}`);
    this.node.on('msg', (peer, msg) => {
      this.content = msg;
    });
    this.node.start();
  }
}
