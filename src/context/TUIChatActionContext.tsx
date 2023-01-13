import React, { PropsWithChildren, useContext } from 'react';
import { Message } from 'tim-js-sdk';
import type {
  CreateCustomMessageProps,
  CreateFaceMessageProps,
  CreateForwardMessageProps,
  CreateLocationMessageProps,
  CreateMergerMessageProps,
  CreateTextAtMessageProps,
  CreateTextMessageProps,
  CreateUploadMessageProps,
} from '../components/TUIChat/hooks/useCreateMessage';
import { OperateMessageParams } from '../components/TUIChat/hooks/useHandleMessage';

export interface TUIChatActionContextValue {
  sendMessage?: (message: Message, options?:any) => Promise<void>,
  removeMessage?: (message: Message) => void,
  updateMessage?: (messages: Array<Message>) => void,
  createTextMessage?: (options: CreateTextMessageProps) => Message,
  createFaceMessage?: (options: CreateFaceMessageProps) => Message,
  createImageMessage?: (options: CreateUploadMessageProps) => Message,
  createVideoMessage?: (options: CreateUploadMessageProps) => Message,
  createFileMessage?: (options: CreateUploadMessageProps) => Message,
  createForwardMessage?: (options: CreateForwardMessageProps) => Message,
  createCustomMessage?: (options: CreateCustomMessageProps) => Message,
  createAudioMessage?: (options: CreateUploadMessageProps) => Message,
  createTextAtMessage?: (options: CreateTextAtMessageProps) => Message,
  createLocationMessage?: (options: CreateLocationMessageProps) => Message,
  createMergerMessage?: (options: CreateMergerMessageProps) => Message,
  editLocalmessage?: (message: Message) => void,
  operateMessage?: (data?: OperateMessageParams) => void,
  loadMore?: () => Promise<void>,
  revokeMessage?: (message:Message) => Promise<Message>,
  setAudioSource?: (source: HTMLAudioElement | null) => void,
  setVideoSource?: (source: HTMLVideoElement | null) => void,
  setHighlightedMessageId?: (highlightedMessageId: string) => void,
  updataUploadPenddingMessageList?: (message?:Message) => void,
}

export const TUIChatActionContext = React.createContext<
TUIChatActionContextValue | undefined>(
  undefined,
);

export function TUIChatActionProvider({
  children,
  value,
}: PropsWithChildren<{
  value: TUIChatActionContextValue
}>):React.ReactElement {
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
