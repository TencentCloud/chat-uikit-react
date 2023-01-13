import React, {
  PropsWithChildren, useContext, MutableRefObject, RefObject,
} from 'react';
import { Conversation, Message } from 'tim-js-sdk';
import { MessageListProps, TUIMessageInputBasicProps, TUIMessageProps } from '../components';
import { OperateMessageParams } from '../components/TUIChat/hooks/useHandleMessage';

export interface TUIChatStateContextValue {
  conversation?: Conversation,
  messageList?: Array<Message>,
  nextReqMessageID?: string,
  isCompleted?: boolean,
  init?: boolean,
  highlightedMessageId?: string,
  lastMessageID?:string,
  isSameLastMessageID?: boolean,
  messageListRef?: RefObject<HTMLDivElement>,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  operateData?: OperateMessageParams,
  noMore?: boolean,
  messageConfig?: TUIMessageProps,
  cloudCustomData?: string,
  TUIMessageInputConfig?: TUIMessageInputBasicProps,
  audioSource?: HTMLAudioElement,
  vidoeSource?: HTMLVideoElement,
  TUIMessageListConfig?: MessageListProps,
  uploadPenddingMessageList?: Array<Message>,
}

export const TUIChatStateContext = React.createContext<TUIChatStateContextValue>(null);
export function TUIChatStateContextProvider({ children, value }:PropsWithChildren<{
    value: TUIChatStateContextValue
}>):React.ReactElement {
  return (
    <TUIChatStateContext.Provider value={value}>
      {children}
    </TUIChatStateContext.Provider>
  );
}

export function useTUIChatStateContext(componentName?:string)
:TUIChatStateContextValue {
  const contextValue = useContext(TUIChatStateContext);
  if (!contextValue && componentName) {
    return {} as TUIChatStateContextValue;
  }
  return (contextValue as unknown) as TUIChatStateContextValue;
}
