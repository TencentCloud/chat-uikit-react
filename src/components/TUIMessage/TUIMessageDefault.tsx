import React, { PropsWithChildren } from 'react';
import TIM from 'tim-js-sdk';
import type { TUIMessageProps } from './TUIMessage';

import { MessageBubble } from './MessageBubble';
import { MessageTip } from './MessageTip';

import './styles/index.scss';
import { Avatar } from '../Avatar';
import { useComponentContext } from '../../context';
import { handleDisplayAvatar } from '../untils';
import { MessageSystem } from './MessageSystem';
import { MessageRevoke } from './MessageRevoke';
import { MESSAGE_FLOW } from '../../constants';

function TUIMessageDefaultWithContext <T extends TUIMessageProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    MessageContext: propsMessageContext,
    MessagePlugins: propsMessagePlugins,
  } = props;

  const {
    MessageContext: contextMessageContext,
    MessagePlugins: contextMessagePlugins,
  } = useComponentContext('TUIMessage');

  const MessageContextUIComponent = propsMessageContext || contextMessageContext;
  const MessagePlugins = propsMessagePlugins || contextMessagePlugins;

  return (
    <div className={`message-default ${(message?.type === TIM.TYPES.MSG_GRP_TIP || message?.isRevoked) ? 'tip' : message?.flow}`}>
      {
        message?.type === TIM.TYPES.MSG_GRP_TIP
        && (<MessageTip message={message} />)
      }
      {
        message?.type === TIM.TYPES.MSG_GRP_SYS_NOTICE
        && (<MessageSystem message={message} />)
      }
      {
        message?.isRevoked
        && (<MessageRevoke message={message} />)
      }
      {message?.type !== TIM.TYPES.MSG_GRP_TIP
      && message?.type !== TIM.TYPES.MSG_GRP_SYS_NOTICE
      && !message?.isRevoked
      && (
      <div
        className={`${message?.flow}`}
        key={message?.ID}
        data-message-id={message?.ID}
      >
        {message?.flow === MESSAGE_FLOW.IN
                    && (
                    <Avatar size={32} image={handleDisplayAvatar(message?.avatar)} />
                    )}
        <main className="content">
          {message?.conversationType === TIM.TYPES.CONV_GROUP
                && message?.flow === MESSAGE_FLOW.IN && (
                <label htmlFor="content" className="name">
                  {message?.nick || message?.from}
                </label>
          )}
          <MessageBubble
            message={message}
            Context={MessageContextUIComponent}
            Plugins={MessagePlugins}
          >
            <MessageContextUIComponent message={message} />
          </MessageBubble>
        </main>
      </div>
      )}
    </div>
  );
}

const MemoizedTUIMessageDefault = React.memo(TUIMessageDefaultWithContext) as
typeof TUIMessageDefaultWithContext;

export function TUIMessageDefault(props:TUIMessageProps):React.ReactElement {
  const {
    message,
  } = props;
  return (
    <MemoizedTUIMessageDefault
      {...props}
    />
  );
}
