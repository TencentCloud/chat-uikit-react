import React, { PropsWithChildren, useContext } from 'react';
import { Message } from '@tencentcloud/chat';
import { IMessageModel } from '@tencentcloud/chat-uikit-engine';
import { OperateMessageParams } from '../components/Chat/hooks/useHandleMessage';

export interface TUIChatActionContextValue {
  updateMessage?: (messages: Message[]) => void;
  setFirstSendMessage?: (message: IMessageModel) => void;
  editLocalMessage?: (message: Message) => void;
  operateMessage?: (data?: OperateMessageParams) => void;
  loadMore?: () => Promise<void>;
  revokeMessage?: (message: Message) => Promise<Message>;
  setAudioSource?: (source: HTMLAudioElement | null) => void;
  setVideoSource?: (source: HTMLVideoElement | null) => void;
  setHighlightedMessageId?: (highlightedMessageId: string) => void;
  updateUploadPendingMessageList?: (message?: Message) => void;
  setActiveMessageID?: (messageID: string) => void;
  callButtonClicked?: (callMediaType?: number, callType?: any) => void;
}

export const TUIChatActionContext = React.createContext<
TUIChatActionContextValue | undefined>(
  undefined,
);

export function TUIChatActionProvider({
  children,
  value,
}: PropsWithChildren<{
  value: TUIChatActionContextValue;
}>): React.ReactElement {
  return (
    <TUIChatActionContext.Provider
      value={(value as unknown) as TUIChatActionContextValue}
    >
      {children}
    </TUIChatActionContext.Provider>
  );
}

export const useTUIChatActionContext = (
  componentName?: string,
) => {
  const contextValue = useContext(TUIChatActionContext);

  if (!contextValue) {
    return {} as TUIChatActionContextValue;
  }

  return (contextValue as unknown) as TUIChatActionContextValue;
};
