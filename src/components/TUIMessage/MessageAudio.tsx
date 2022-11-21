import React, { PropsWithChildren } from 'react';
import type { MessageContextProps } from './MessageText';

function MessageAudioWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  return (
    <div className="message-audio">
      <audio muted src={context.url} />
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
