import React, {
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { MESSAGE_STATUS } from '../../constants';
import { Icon, IconTypes } from '../Icon';
import { useMessageReply } from './hooks/useMessageReply';

export interface MessageBubbleProps {
  message?: Message,
  className?: string,
  children?: ReactNode,
  Context?: React.ComponentType<any>,
  Plugins?: React.ComponentType<any>,
}

function MessageBubbleWithContext <T extends MessageBubbleProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    children,
    Context,
    Plugins,
  } = props;

  const [PluginsShow, setPluginsShow] = useState(false);

  const {
    messageReply,
    replyMessage,
    sender,
  } = useMessageReply({ message });

  const handleLoading = () => !!((
    message?.type === TIM.TYPES.MSG_IMAGE
    || message?.type === TIM.TYPES.MSG_VIDEO
    || message?.type === TIM.TYPES.MSG_FILE
  ) && message?.status === MESSAGE_STATUS.UNSEND);

  const handleMouseEnter = () => {
    setPluginsShow(true);
  };
  const handleMouseLeave = () => {
    setPluginsShow(false);
  };

  return (
    <div className="meesage-bubble">
      <div
        className={`meesage-bubble-context ${message?.flow}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={
            `message-context
            ${messageReply ? `meesage-bubble-reply meesage-bubble-reply-${message?.flow}` : ''}
            ${handleLoading() ? 'loading' : ''}`
          }
        >
          {
            messageReply && (
            <main className="meesage-bubble-reply-main">
              <header className="title">{sender}</header>
              {Context && <Context message={replyMessage} />}
            </main>
            )
          }
          {children}
        </div>
        <div className="message-plugin">
          {PluginsShow && Plugins && <Plugins />}
        </div>
      </div>
      <div className="message-bubble-status icon">
        {
          message?.status === MESSAGE_STATUS.FAIL
          && <i className="icon-fail" />
        }
        {
          message?.status === MESSAGE_STATUS.UNSEND
          && <Icon width={10} height={10} type={IconTypes.PROGRESS} />
        }
      </div>
    </div>
  );
}

const MemoizedMessageBubble = React.memo(MessageBubbleWithContext) as
typeof MessageBubbleWithContext;

export function MessageBubble(props:MessageBubbleProps):React.ReactElement {
  return (
    <MemoizedMessageBubble {...props} />
  );
}
