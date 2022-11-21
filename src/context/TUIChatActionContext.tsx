import React, { PropsWithChildren, useContext } from 'react';
import { Message } from 'tim-js-sdk';
import type {
  CreateFaceMessageProps,
  CreateForwardMessageProps,
  CreateTextMessageProps,
  CreateUploadMessageProps,
} from '../components/TUIChat/hooks/useCreateMessage';
import { OperateMessageParams } from '../components/TUIChat/hooks/useHandleMessage';

export interface TUIChatActionContextValue {
  sendMessage?: (message: Message) => Promise<void>,
  removeMessage?: (message: Message) => void,
  updateMessage?: (messages: Array<Message>) => void,
  createTextMessage?: (options: CreateTextMessageProps) => Message,
  createFaceMessage?: (options: CreateFaceMessageProps) => Message,
  createImageMessage?: (options: CreateUploadMessageProps) => Message,
  createVideoMessage?: (options: CreateUploadMessageProps) => Message,
  createFileMessage?: (options: CreateUploadMessageProps) => Message,
  createForwardMessage?: (options: CreateForwardMessageProps) => Message,
  editLocalmessage?: (message: Message) => void,
  operateMessage?: (data?: OperateMessageParams) => void,
  loadMore?: () => Promise<void>,
  revokeMessage?: (message:Message) => Promise<Message>,
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
