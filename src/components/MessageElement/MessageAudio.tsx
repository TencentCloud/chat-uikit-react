import React, {
  PropsWithChildren, useCallback, useEffect, useRef, useState,
} from 'react';
import { useTUIChatActionContext, useTUIChatStateContext } from '../../context';
import { Icon, IconTypes } from '../Icon';
import type { MessageContextProps } from './MessageText';

function MessageAudioWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  const { setAudioSource } = useTUIChatActionContext('MessageAudioWithContext');
  const { audioSource } = useTUIChatStateContext('MessageAudioWithContext');
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playClassName, setPlayClassName] = useState(false);

  const play = useCallback(() => {
    if (audioSource && audioSource !== audioRef?.current) {
      audioSource.pause();
      audioSource.currentTime = 0;
      setAudioSource && setAudioSource(null);
    }
    if (audioRef?.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        endFunction();
      } else {
        audioRef.current.play();
        setPlayClassName(true);
        setAudioSource && setAudioSource(audioRef.current);
      }
    }
  }, [audioRef, audioSource]);

  const pauseFunction = () => {
    setPlayClassName(false);
  };
  const endFunction = () => {
    setAudioSource && setAudioSource(null);
    if(audioRef.current) {
      audioRef.current.currentTime = 0
    }
    pauseFunction();
  };

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.addEventListener('pause', pauseFunction);
      audioRef.current.addEventListener('ended', endFunction);
      audioRef.current.addEventListener('canplay', () => {
        setCurrentTime(parseInt(`${audioRef.current?.duration}`, 10));
      });
    }
    return () => {
      if (audioRef?.current) {
        audioRef.current.removeEventListener('pause', pauseFunction);
        audioRef.current.removeEventListener('ended', endFunction);
      }
    };
  }, [audioRef]);

  return (
    <div className="message-audio">
      <div className={`message-audio-content message-audio-${message?.flow}`}>
        <Icon className={`${message?.flow} ${playClassName ? 'playing' : ''}`} type={IconTypes.VOICE} width={16} height={16} onClick={play} />
        <span>{`${currentTime}s`}</span>
      </div>
      <audio src={context?.url} ref={audioRef} controls className="message-audio-none">
        <track kind="captions" />
      </audio>
      {children}
    </div>
  );
}

const MemoizedMessageAudio = React.memo(MessageAudioWithContext) as
typeof MessageAudioWithContext;

export function MessageAudio(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageAudio {...props} />
  );
}
