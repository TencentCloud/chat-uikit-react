import React, { PropsWithChildren } from 'react';
import { useMessageContextHandler } from './hooks';
import type { MessageContextProps } from './MessageText';

function MessageTipWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { context } = useMessageContextHandler({ message });

  return (
    <div className="bubble message-tip">
      {context.text}
    </div>
  );
}

const MemoizedMessageTip = React.memo(MessageTipWithContext) as
typeof MessageTipWithContext;

export function MessageTip(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageTip {...props} />
  );
}
