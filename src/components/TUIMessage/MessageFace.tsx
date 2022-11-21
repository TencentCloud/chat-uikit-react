import React, { PropsWithChildren } from 'react';
import type { MessageContextProps } from './MessageText';

function MessageFaceWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  return (
    <div className={`bubble message-face bubble-${message.flow}`}>
      <img className="img" src={context.url} alt="" />
      {children}
    </div>
  );
}

const MemoizedMessageFace = React.memo(MessageFaceWithContext) as
typeof MessageFaceWithContext;

export function MessageFace(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageFace {...props} />
  );
}
