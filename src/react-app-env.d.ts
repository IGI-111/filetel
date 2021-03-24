/// <reference types="react-scripts" />

declare module 'p2pt' {
  import { Instance } from 'parse-torrent';
  interface Peers {}
  interface Peer {}
  type Message = string | Buffer | File | Instance;
  interface Data {}
  interface WebSocketTracker {}
  interface Stats {}
  interface Error {}

  interface P2PT extends NodeJS.EventEmitter {}
  class P2PT implements P2PT {
    on(event: 'peerconnect', handler: (peer: Peer) => void): this;
    on(event: 'data', handler: (peer: Peer, data: Data) => void): this;
    on(event: 'msg', handler: (peer: Peer, msg: Message) => void): this;
    on(event: 'peerclose', handler: (peer: Peer) => void): this;
    on(
      event: 'trackerconnect',
      handler: (tracker: WebSocketTracker, stats: Stats) => void
    ): this;
    on(
      event: 'trackerwarning',
      handler: (err: Error, stats: Stats) => void
    ): this;
    constructor(announceURLs: string[], identifierString: string);
    setIdentifier(identifierString: string): void;
    start(): void;
    requestMorePeers(): Promise<Peers>;
    send(peer: Peer, msg: Message, msgID?: number): Promise<[Peer, Message]>;
    destroy(): void;
  }
  export = P2PT;
}
