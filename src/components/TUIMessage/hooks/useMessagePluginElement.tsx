import React, { PropsWithChildren } from 'react';
import TIM, { Message } from 'tim-js-sdk';

interface MessagePluginElementProps {
  handle?: (event?:React.SyntheticEvent<Element, Event>) => void,
  children: React.ReactNode,
  isShow?: boolean,
  relateMessageType?: TIM.TYPES[],
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
