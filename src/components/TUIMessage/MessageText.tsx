import React, { PropsWithChildren } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
import { UnknowPorps, useTUIChatStateContext, useComponentContext } from '../../context';

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
  const { MessageTextPlugins } = useComponentContext('MessageText');
  const { firstSendMessage } = useTUIChatStateContext('MessageText');
  if (MessageTextPlugins && message.flow === 'in' && (firstSendMessage?.time <= message?.time)) {
    return (
      <div className={`bubble message-text bubble-${message.flow} ${message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP ? 'group' : ''}`}>
        <MessageTextPlugins data={message} />
      </div>
    );
  }
  const urlToLink = function (text: string) {
    if (!text) {
      return text;
    }
    // eslint-disable-next-line no-useless-escape
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, (website) => `<a class='website' href='${website}' target='_blank'>${website}</a>`);
  };
  return (
    <div className={`bubble message-text bubble-${message.flow} ${message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP ? 'group' : ''}`}>
      <div className="message-text-content">
        {context.text.map((item, index) => {
          const key = message.ID + index;
          if (item.name === 'text') {
            return (
              <p
                className="message-text-content-p"
                key={item.src + key}
                dangerouslySetInnerHTML={{ __html: urlToLink(item.text) }}
              />
            );
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
