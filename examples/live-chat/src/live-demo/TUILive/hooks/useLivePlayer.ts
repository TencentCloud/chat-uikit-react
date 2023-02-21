import { useEffect, useState } from 'react';

const playerBasicUrl = 'https://web.sdk.qcloud.com/player/tcplayer/release';
const playerVersion = 'v4.6.0';
const urlMap = {
  link: {
    type: 'link',
    url: 'tcplayer.min.css',
    isOnload: false,
  },
  TXLivePlayer: {
    type: 'script',
    url: 'libs/TXLivePlayer-1.2.3.min.js',
    isOnload: false,
  },
  hls: {
    type: 'script',
    url: 'libs/hls.min.1.1.5.js',
    isOnload: false,
  },
  flv: {
    type: 'script',
    url: 'libs/flv.min.1.6.3.js',
    isOnload: false,
  },
  dash: {
    type: 'script',
    url: 'libs/dash.all.min.4.4.1.js',
    isOnload: false,
  },
  tcplayer: {
    type: 'script',
    url: 'tcplayer.v4.6.0.min.js',
    isOnload: false,
  },
};

export function useLivePlayer(playerRef?: HTMLVideoElement) {
  const [TCPlayer, setTCPlayer] = useState<any>(null);
  const [urls, setUrls] = useState<any>(urlMap);
  const [isOnload, setIsOnload] = useState(false);

  const initAssert = () => {
    if (!(window as any)?.TCPlayer) {
      Object.keys(urls).map((item) => {
        const dom = document.createElement(urls[item].type);
        if (urls[item].type === 'link') {
          dom.href = `${playerBasicUrl}/${playerVersion}/${urls[item].url}`;
          dom.rel = 'stylesheet';
        } else {
          dom.src = `${playerBasicUrl}/${playerVersion}/${urls[item].url}`;
        }
        document.body.appendChild(dom);
        dom.onload = () => {
          urls[item].isOnload = true;
          setUrls(urls);
          setIsOnload(Object.keys(urls).every((val) => urls[val].isOnload));
        };
        return item;
      });
    } else {
      setIsOnload(true);
    }
  };

  useEffect(() => {
    (async () => {
      await initAssert();
    })();
  }, []);

  useEffect(() => {
    if (isOnload && playerRef) {
      const player = (window as any)?.TCPlayer(playerRef?.id, {});
      setTCPlayer(player);
    }
  }, [isOnload, playerRef]);

  return {
    TCPlayer,
  };
}
