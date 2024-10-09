import React, { PropsWithChildren } from 'react';
import { useMessageContextHandler } from './hooks';
import type { MessageContextProps } from './MessageText';

function MessageSystemWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
  } = props;

  const { context } = useMessageContextHandler({ message });

  return (
    <div className="bubble message-system">
      <div>
        {context}
      </div>
    </div>
  );
}

const MemoizedMessageSystem = React.memo(MessageSystemWithContext) as
typeof MessageSystemWithContext;

export function MessageSystem(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageSystem {...props} />
  );
}
