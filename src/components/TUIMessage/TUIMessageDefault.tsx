import React, { PropsWithChildren } from 'react';
import TIM from 'tim-js-sdk';
import type { TUIMessageProps } from './TUIMessage';

import { MessageBubble } from './MessageBubble';
import { MessageTip } from './MessageTip';

import './styles/index.scss';
import { messageShowType, useComponentContext, useTUIMessageContext } from '../../context';
import { MessageSystem } from './MessageSystem';
import { MessageRevoke } from './MessageRevoke';
import { MessageName } from './MessageName';
import { MessageAvatar } from './MessageAvatar';

function TUIMessageDefaultWithContext <T extends TUIMessageProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    MessageContext: propsMessageContext,
    MessagePlugins: propsMessagePlugins,
    className,
  } = props;

  const {
    MessageContext: contextMessageContext,
    MessagePlugins: contextMessagePlugins,
  } = useComponentContext('TUIMessage');

  const {
    prefix,
    suffix,
    customName,
    showAvatar = messageShowType.IN,
    showName = messageShowType.IN,
    customAvatar,
  } = useTUIMessageContext('TUIMessage');

  const MessageContextUIComponent = propsMessageContext || contextMessageContext;
  const MessagePlugins = propsMessagePlugins || contextMessagePlugins;

  return (
    <div
      className={
      `message-default
      ${(message?.type === TIM.TYPES.MSG_GRP_TIP || message?.isRevoked) ? 'tip' : message?.flow}
      ${className}
      `
      }
    >
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
        {prefix}
        <MessageAvatar message={message} CustomAvatar={customAvatar} showType={showAvatar} />
        <main className="content">
          <MessageName message={message} CustomName={customName} showType={showName} />
          <MessageBubble
            message={message}
            Context={MessageContextUIComponent}
            Plugins={MessagePlugins}
          >
            <MessageContextUIComponent message={message} />
          </MessageBubble>
        </main>
        {suffix}
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
