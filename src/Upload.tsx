import { RouteComponentProps } from 'react-router-dom';
import QRCode from 'qrcode.react';
import prettyBytes from 'pretty-bytes';
import trackers from './trackers';
import P2PT from 'p2pt';
import { Fragment, useState, useEffect, ChangeEvent } from 'react';
import WebTorrent, { Torrent } from 'webtorrent';
import { randomWords } from './wordlist';
import Spinner from './Spinner';

function Upload(props: RouteComponentProps<{}>) {
  const [hasSelectedFiles, setHasSelectedFiles] = useState<boolean>();
  const [code, setCode] = useState<string>('');
  const [seeder] = useState(new WebTorrent());
  const [torrent, setTorrent] = useState<Torrent>();
  const [node, setNode] = useState<P2PT>();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Date.now());
    }, 500);
    return () => {
      if (node !== undefined) {
        node.destroy();
      }
      clearInterval(timer);
    };
  }, []);

  const buildRoute = () => {
    return `/${code.trim().replaceAll(' ', '/')}`;
  };
  const buildLinkHref = () => {
    return `${window.location.protocol}//${
      window.location.host
    }${buildRoute()}`;
  };

  const redirectToDownload = () => {
    props.history.push(buildRoute());
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files === null) {
      return;
    }
    const file = files.item(0);
    if (file === null) {
      return;
    }
    setHasSelectedFiles(true);

    const code = randomWords(5).join(' ');
    setCode(code);
    const node = new P2PT(trackers, `cherami-${code}`);
    setNode(node);

    seeder.seed(file, { announce: trackers }, (torrent) => {
      setTorrent(torrent);

      console.log(torrent.magnetURI);

      node.on('peerconnect', async (peer) => {
        console.log('sent');
        await node.send(
          peer,
          JSON.stringify({
            magnet: torrent.magnetURI,
            fileName: file.name,
          })
        );
      });
      node.start();
    });
  };

  return (
    <Fragment>
      {!hasSelectedFiles && (
        <Fragment>
          <div className="file">
            <label className="file-label">
              <input
                onChange={handleFileChange}
                className="file-input"
                type="file"
              />
              <span className="file-cta">
                <span className="file-label">Choose a file to transfer…</span>
              </span>
            </label>
          </div>
          <div>or</div>
          <div className="field has-addons">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Type your code to receive a file"
                onChange={(e) => setCode(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    redirectToDownload();
                  }
                }}
              />
            </div>
            <div className="control">
              <a className="button" onClick={redirectToDownload}>
                Receive
              </a>
            </div>
          </div>
        </Fragment>
      )}
      {hasSelectedFiles && (
        <Fragment>
          {torrent === undefined && <Spinner />}
          {torrent !== undefined && (
            <Fragment>
              <h2 className="has-text-centered">Uploading</h2>
              <div className="level">
                <div className="level-item has-text-centered">
                  <div>
                    <h4 className="heading">Peers</h4>
                    <p className="title">{torrent.numPeers}</p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <h4 className="heading">Upload</h4>
                    <p className="title">
                      {prettyBytes(torrent.uploadSpeed)}/s
                    </p>
                  </div>
                </div>
                <div className="level-item has-text-centered">
                  <div>
                    <h4 className="heading">Size</h4>
                    <p className="title">{prettyBytes(torrent.length)}</p>
                  </div>
                </div>
              </div>
              <div className="is-size-3 has-text-centered"> {code}</div>
              Enter your code on a new page or go to the following address to
              download the file.
              <br />
              The link and code will stay valid as long as this page is open.
              <br />
              <div className="has-text-centered">
                <a href={buildLinkHref()} className="is-size-4">
                  {buildLinkHref()}
                </a>
                <br />
                <QRCode
                  bgColor="#17181c"
                  fgColor="#b5b5b5"
                  value={buildLinkHref()}
                />
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default Upload;
