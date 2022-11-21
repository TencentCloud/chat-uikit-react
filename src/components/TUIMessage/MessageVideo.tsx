import React, { PropsWithChildren, useState } from 'react';
import { MESSAGE_STATUS } from '../../constants';
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

  return (
    <div className="message-video">
      <div className={`${message?.status === MESSAGE_STATUS.SUCCESS ? 'snap-video' : ''}`} role="button" tabIndex={0} onClick={() => { setShow(true); }}>
        <video muted controls={false} src={context.url} />
      </div>

      {children}
      {
        show && (
        <Model onClick={() => { setShow(false); }}>
          <video className="play-video" muted controls src={context.url} />
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
