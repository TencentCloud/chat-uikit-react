import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { useTUILiveContext } from './context/TUILiveContext';
import { useLivePlayer } from './hooks/useLivePlayer';
import './styles/index.scss';

export interface TUILiveContentBaseProps {
  url?: string,
  className?: string,
}

interface TUILiveContentProps extends TUILiveContentBaseProps {
  TUILiveContent?: React.ComponentType<TUILiveContentBaseProps>,
}

function UnMemoizedTUILiveContent<T extends TUILiveContentProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    url: propsUrl,
    TUILiveContent,
  } = props;

  const playerRef = useRef<HTMLVideoElement | any>(null);

  const {
    url: contextUrl,
  } = useTUILiveContext('TUILiveHeader');

  const url = propsUrl || contextUrl || '';

  const reg = /(http(s)?:\/\/)?\w+(\.\w+)+\/(\w+\/)*(.*?\.)+(swf|avi|flv|mpg|mov|wav|3gp|mkv|rmvb|mp3|mp4)/;

  if (!reg.test(url)) {
    throw new Error('The url is invalid, please fill in the correct url');
  }

  if (TUILiveContent) (<TUILiveContent url={url} />);

  const { TCPlayer } = useLivePlayer(playerRef?.current);

  const ID = `player-container-${new Date().getTime()}`;

  useEffect(() => {
    if (playerRef && TCPlayer) {
      TCPlayer.src(url);
    }
  }, [playerRef, TCPlayer]);

  return (
    <video
      autoPlay
      muted
      loop
      controls
      className={`tui-live-content ${className}`}
      id={ID}
      preload="auto"
      playsInline
      ref={playerRef}
    >
      <source src="" />
    </video>
  );
}

export const TUILiveContent = React.memo(UnMemoizedTUILiveContent) as
typeof UnMemoizedTUILiveContent;
