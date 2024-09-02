import React, { PropsWithChildren } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
import { UnknowPorps, useTUIChatStateContext, useComponentContext } from '../../context';

export interface MessageContextProps {
  context?: UnknowPorps;
  message?: Message;
  className?: string;
}

function MessageTextWithContext(props: PropsWithChildren<MessageContextProps>) {
  const {
    context,
    message,
    children,
  } = props;

  const { MessageTextPlugins } = useComponentContext('MessageText');
  const { firstSendMessage } = useTUIChatStateContext('MessageText');

  if (MessageTextPlugins && message?.flow === 'in' && (firstSendMessage && firstSendMessage?.time <= message?.time)) {
    return (
      <div className={`bubble message-text bubble-${message.flow} ${message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP ? 'group' : ''}`}>
        <MessageTextPlugins data={message} />
      </div>
    );
  }

  function urlToLink(text: string) {
    if (!text) {
      return text;
    }
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, website => `<a class='website' href='${website}' target='_blank'>${website}</a>`);
  }

  return (
    <div className={`bubble message-text bubble-${message?.flow} ${message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP ? 'group' : ''}`}>
      <div className="message-text-content">
        {context?.text.map((item: any, index: number) => {
          const key = message && message?.ID + index;
          if (item.name === 'text') {
            return (
              <p
                className="message-text-content-p"
                key={item.src + key}
              >
                {item.text}
              </p>
            );
          }
          return <img className="text-img" key={item.src + key} src={item.src} alt="" />;
        })}
        {children}
      </div>
    </div>
  );
}

const MemoizedMessageText = React.memo(MessageTextWithContext) as typeof MessageTextWithContext;

export function MessageText(props: MessageContextProps) {
  return (
    <MemoizedMessageText {...props} />
  );
}
