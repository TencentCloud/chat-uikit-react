import React, { PropsWithChildren } from 'react';
import { Icon, IconTypes } from '../Icon';
import type { MessageContextProps } from './MessageText';

function MessageFileWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  return (
    <div className={`bubble message-file bubble-${message.flow}`}>
      <main className="message-file-main">
        <Icon className="icon" width={15} height={20} type={IconTypes.FILE} />
        <label htmlFor="message-file">{ context.name }</label>
      </main>
      <div className="message-file-footer">
        <span className="message-file-size">{ context.size }</span>
        {children}
      </div>
    </div>
  );
}

const MemoizedMessageFile = React.memo(MessageFileWithContext) as
typeof MessageFileWithContext;

export function MessageFile(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageFile {...props} />
  );
}
