import React, { PropsWithChildren } from 'react';
import { Message } from 'tim-js-sdk';
import { UnknowPorps } from '../../context';

export interface MessageContextProps {
  context?: UnknowPorps,
  message?: Message,
  className?: string,
}

function MessageTextWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  return (
    <div className={`bubble message-text bubble-${message.flow}`}>
      <div className="message-text-content">
        {context.text.map((item, index) => {
          const key = message.ID + index;
          if (item.name === 'text') {
            return item.text;
          }
          return <img className="text-img" key={item.src + key} src={item.src} alt="" />;
        })}
        {children}
      </div>
    </div>
  );
}

const MemoizedMessageText = React.memo(MessageTextWithContext) as
typeof MessageTextWithContext;

export function MessageText(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageText {...props} />
  );
}
