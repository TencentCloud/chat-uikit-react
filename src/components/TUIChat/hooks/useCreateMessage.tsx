import { useCallback, useEffect, useState } from 'react';
import TencentCloudChat, { ChatSDK, Conversation, Message } from '@tencentcloud/chat';

export interface CreateMessageProps {
  chat?: ChatSDK,
  conversation?: Conversation,
  to?: string,
  type?: TencentCloudChat.TYPES,
  cloudCustomData?: string,
}
export interface BasicCreateMessageProps {
  needReadReceipt?: boolean,
  priority?: TencentCloudChat.TYPES,
  onProgress?: (num:number) => void,
  cloudCustomData?: string;
  receiverList?: Array<string>;
}

export interface CreateTextMessageProps extends BasicCreateMessageProps{
  payload: {
    text: string
  }
}

export interface CreateFaceMessageProps extends BasicCreateMessageProps{
  payload: {
    index: number,
    data: string,
  }
}

export interface CreateUploadMessageProps extends BasicCreateMessageProps{
  payload: {
    file: HTMLInputElement | File,
  }
}

export interface CreateForwardMessageProps extends BasicCreateMessageProps{
  conversation: Conversation,
  message: Message
}

export interface CreateCustomMessageProps extends BasicCreateMessageProps{
  payload: {
    data: string,
    description: string,
    extension: string,
  }
}

export interface CreateTextAtMessageProps extends BasicCreateMessageProps{
  payload: {
    text: string,
    atUserList: Array<string>,
  }
}

export interface CreateLocationMessageProps extends BasicCreateMessageProps{
  payload: {
    description: string,
    longitude: number,
    latitude: number,
  }
}

export interface CreateMergerMessageProps extends BasicCreateMessageProps{
  payload: {
    messageList: Array<Message>,
    title: string,
    abstractList: string,
    compatibleText: string,
  }
}

export function useCreateMessage<T extends CreateMessageProps>(props:T) {
  const {
    chat,
    conversation,
    to = '',
    type: propType,
    cloudCustomData,
  } = props;

  const { type: conversationType, userProfile, groupProfile } = conversation;

  const type = propType || conversationType;

  const [basicConfig, setBasicConfig] = useState({
    to: to || (type === TencentCloudChat.TYPES.CONV_C2C ? userProfile?.userID : groupProfile?.groupID),
    conversationType: type,
    cloudCustomData,
  });

  useEffect(() => {
    basicConfig.cloudCustomData = cloudCustomData;
    setBasicConfig(basicConfig);
  }, [cloudCustomData]);

  const createTextMessage = useCallback((params: CreateTextMessageProps) => chat.createTextMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createFaceMessage = useCallback((params: CreateFaceMessageProps) => chat.createFaceMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createImageMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => chat.createImageMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createVideoMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => chat.createVideoMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createFileMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => chat.createFileMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createForwardMessage = useCallback((
    params: CreateForwardMessageProps,
  ) => {
    const { conversation: forwardConversation, message, ...other } = params;
    const {
      type: forwardType,
      userProfile: forwardUserProfile,
      groupProfile: forwardGroupProfile,
    } = forwardConversation;
    const forwardTo = forwardType === TencentCloudChat.TYPES.CONV_C2C
      ? forwardUserProfile?.userID : forwardGroupProfile?.groupID;
    return chat.createForwardMessage({
      to: forwardTo,
      conversationType: forwardType,
      payload: message,
      ...other,
    });
  }, [chat]);

  const createCustomMessage = useCallback((
    params: CreateCustomMessageProps,
    // ChatSDK < V2.26.0 createCustomMessage ts declaration error
  ) => (chat as any).createCustomMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createAudioMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => chat.createAudioMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createTextAtMessage = useCallback((
    params: CreateTextAtMessageProps,
  ) => chat.createTextAtMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createLocationMessage = useCallback((
    params: CreateLocationMessageProps,
  ) => chat.createLocationMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  const createMergerMessage = useCallback((
    params: CreateMergerMessageProps,
  ) => chat.createMergerMessage({
    ...basicConfig,
    ...params,
  }), [chat]);

  return {
    createTextMessage,
    createFaceMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
    createForwardMessage,
    createCustomMessage,
    createAudioMessage,
    createTextAtMessage,
    createLocationMessage,
    createMergerMessage,
  };
}
