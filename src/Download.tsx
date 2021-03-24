import { RouteComponentProps } from 'react-router-dom';
import P2PT from 'p2pt';
import { Fragment, useEffect, useState } from 'react';
import WebTorrent, { Torrent } from 'webtorrent';
import trackers from './trackers';
import prettyBytes from 'pretty-bytes';
import Spinner from './Spinner';

function Download(props: RouteComponentProps<{ code: string }>) {
  const code = props.match.params.code
    .replaceAll('/', ' ')
    .trim()
    .toLowerCase();
  const [fileName, setFileName] = useState<string>();
  const [torrent, setTorrent] = useState<Torrent>();
  const [node] = useState<P2PT>(new P2PT(trackers, `cherami-${code}`));
  const [leecher] = useState(new WebTorrent());
  const [fileURI, setFileURI] = useState<string>();

  useEffect(() => {
    node.on('msg', (_peer, msg) => {
      const { magnet, fileName } = JSON.parse(msg.toString());
      setFileName(fileName);

      leecher.add(magnet, { announce: trackers }, (torrent: Torrent) => {
        console.log('torrent', torrent);
        setTorrent(torrent);

        torrent.on('done', () => {
          torrent.files[0].getBlobURL((_err: any, url?: string) => {
            setFileURI(url);
          });
        });
      });
    });
    node.start();
    return () => {
      node.destroy();
      leecher.destroy();
    };
  }, [node, leecher]);

  return (
    <Fragment>
      {torrent === undefined && <Spinner />}
      {torrent !== undefined && (
        <Fragment>
          <h2 className="has-text-centered">Downloading</h2>
          {fileURI === undefined && <DownloadStatus torrent={torrent} />}
          {fileURI !== undefined && (
            <Fragment>
              <div className="has-text-centered">
                Your file is available:
                <br />
                <a
                  className="button mt-1"
                  ref={(node) => {
                    if (node !== null) {
                      node.click();
                    }
                  }}
                  href={fileURI}
                  download={fileName}
                >
                  Save
                </a>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

function DownloadStatus({ torrent }: { torrent: Torrent }) {
  const [, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Date.now());
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Fragment>
      <progress
        className="progress is-large"
        value={torrent.progress}
        max={torrent.progress === 1 || torrent.progress === 0 ? undefined : 1}
      />
      <div className="level">
        <div className="level-item has-text-centered">
          <div>
            <h4 className="heading">Peers</h4>
            <p className="title">{torrent.numPeers}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <h4 className="heading">Download</h4>
            <p className="title">{prettyBytes(torrent.downloadSpeed)}/s</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <h4 className="heading">Size</h4>
            <p className="title">
              {prettyBytes(torrent.downloaded)}/{prettyBytes(torrent.length)}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Download;
