import React, {
  PropsWithChildren, useContext, MutableRefObject, RefObject,
} from 'react';
import { Conversation, Message } from '@tencentcloud/chat';
import { MessageListProps, TUIMessageInputBasicProps, TUIMessageProps } from '../components';
import { OperateMessageParams } from '../components/Chat/hooks/useHandleMessage';

export interface TUIChatStateContextValue {
  conversation?: Conversation;
  messageList?: Message[];
  nextReqMessageID?: string;
  isCompleted?: boolean;
  init?: boolean;
  highlightedMessageId?: string;
  lastMessageID?: string;
  isSameLastMessageID?: boolean;
  messageListRef?: RefObject<HTMLDivElement>;
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  operateData?: OperateMessageParams;
  noMore?: boolean;
  messageConfig?: TUIMessageProps;
  cloudCustomData?: string;
  TUIMessageInputConfig?: TUIMessageInputBasicProps;
  audioSource?: HTMLAudioElement | null;
  vidoeSource?: HTMLVideoElement | null;
  TUIMessageListConfig?: MessageListProps;
  uploadPendingMessageList?: Message[];
  firstSendMessage?: Message | null;
  activeMessageID?: string;
}

export const TUIChatStateContext = React.createContext<TUIChatStateContextValue | null>(null);
export function TUIChatStateContextProvider({ children, value }: PropsWithChildren<{
  value: TUIChatStateContextValue;
}>): React.ReactElement {
  return (
    <TUIChatStateContext.Provider value={value}>
      {children}
    </TUIChatStateContext.Provider>
  );
}

export function useTUIChatStateContext(componentName?: string): TUIChatStateContextValue {
  const contextValue = useContext(TUIChatStateContext);
  if (!contextValue && componentName) {
    return {} as TUIChatStateContextValue;
  }
  return (contextValue as unknown) as TUIChatStateContextValue;
}
