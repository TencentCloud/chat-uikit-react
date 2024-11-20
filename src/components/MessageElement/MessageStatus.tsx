import React, { PropsWithChildren } from 'react';
import { Message } from '@tencentcloud/chat';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { useTUIMessageContext } from '../../context';
import { getTimeStamp } from '../utils';

export interface MessageContextProps {
  message?: Message;
}

function MessageStatustWithContext<T extends MessageContextProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    message,
  } = props;
  const { language } = useUIKit('TUIChat');
  const {
    isShowTime,
  } = useTUIMessageContext('MessageStatustWithContext');

  const timeElement = (typeof isShowTime === 'undefined' || isShowTime) && <div className="time">{message?.time ? getTimeStamp(message.time * 1000, language) : 0}</div>;

  return (
    <div className="message-status">
      {timeElement}
    </div>
  );
}

const MemoizedMessageStatus = React.memo(MessageStatustWithContext) as
typeof MessageStatustWithContext;

export function MessageStatus(props: MessageContextProps): React.ReactElement {
  return (
    <MemoizedMessageStatus
      {...props}
    />
  );
}
