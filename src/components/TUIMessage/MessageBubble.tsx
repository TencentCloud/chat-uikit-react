import React, {
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { MESSAGE_STATUS } from '../../constants';
import { useTUIChatActionContext } from '../../context';
import { Icon, IconTypes } from '../Icon';
import { useMessageReply } from './hooks/useMessageReply';
import { MessageProgress } from './MessageProgress';

export interface MessageBubbleProps {
  message?: Message,
  className?: string,
  children?: ReactNode,
  Context?: React.ComponentType<any>,
  Plugins?: React.ComponentType<any> | undefined,
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

  const { setHighlightedMessageId } = useTUIChatActionContext('MessageBubbleWithContext');

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

  const handleReplyMessage = () => {
    setHighlightedMessageId(replyMessage?.ID);
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
            <div
              className="meesage-bubble-reply-main"
              role="menuitem"
              tabIndex={0}
              onClick={handleReplyMessage}
            >
              <header className="title">{sender}</header>
              {Context && <Context message={replyMessage} />}
            </div>
            )
          }
          {children}
          <MessageProgress message={message} />
        </div>
        {
          Plugins && (
          <div className="message-plugin">
            {PluginsShow && <Plugins />}
          </div>
          )
        }
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
