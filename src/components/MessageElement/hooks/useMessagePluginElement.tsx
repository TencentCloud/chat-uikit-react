import React, { PropsWithChildren } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';

interface MessagePluginElementProps {
  handle?: (event?:React.SyntheticEvent<Element, Event>) => void,
  children: React.ReactNode,
  isShow?: boolean,
  relateMessageType?: TencentCloudChat.TYPES[],
  message?: Message
}
export const useMessagePluginElement = <
T extends MessagePluginElementProps>(props:PropsWithChildren<T>) => {
  const {
    children,
    handle,
    isShow,
    relateMessageType,
    message,
  } = props;

  const isNotRelateMessageType = relateMessageType
  && !relateMessageType.some((item) => (item === message?.type));

  if (!isShow || isNotRelateMessageType) {
    return null;
  }

  return (
    <div className="message-plugin-box" role="button" tabIndex={0} onClick={handle}>{children}</div>
  );
};
