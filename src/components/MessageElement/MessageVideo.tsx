import React, { PropsWithChildren, useEffect, useState } from 'react';
import { MESSAGE_STATUS } from '../../constants';
import { isH5, isPC } from '../../utils/env';
import { Model } from '../Model';
import type { MessageContextProps } from './MessageText';

function MessageVideoWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  const [show, setShow] = useState(false);
  const transparentPosterUrl = 'https://web.sdk.qcloud.com/im/assets/images/transparent.png';

  return (
    <div className={`message-video ${isH5 ? 'message-video-h5' : ''}`}>
      <div className={`${message?.status === MESSAGE_STATUS.SUCCESS ? 'snap-video' : ''}`} role="button" tabIndex={0} onClick={() => { setShow(true); }}>
        {isPC && (<video muted controls={false} src={context?.url} />)}
        {isH5 && (<img src={message?.payload.snapshotUrl || transparentPosterUrl} style={{ maxHeight: '200px', maxWidth: '200px', borderRadius: '10px' }} />)}
      </div>

      {children}
      {
        show && (
        <Model onClick={(e) => { e.stopPropagation(); setShow(false); }}>
          <video className="play-video" autoPlay controls src={context?.url} />
        </Model>
        )
      }
    </div>
  );
}

const MemoizedMessageVideo = React.memo(MessageVideoWithContext) as
typeof MessageVideoWithContext;

export function MessageVideo(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageVideo {...props} />
  );
}
