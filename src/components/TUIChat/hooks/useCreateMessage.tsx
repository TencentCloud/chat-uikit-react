import { useCallback, useEffect, useState } from 'react';
import TIM, { ChatSDK, Conversation, Message } from 'tim-js-sdk';

export interface CreateMessageProps {
  tim?: ChatSDK,
  conversation?: Conversation,
  to?: string,
  type?: TIM.TYPES,
  cloudCustomData?: string,
}
export interface BasicCreateMessageProps {
  needReadReceipt?: boolean,
  priority?: TIM.TYPES,
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
    tim,
    conversation,
    to = '',
    type: propType,
    cloudCustomData,
  } = props;

  const { type: conversationType, userProfile, groupProfile } = conversation;

  const type = propType || conversationType;

  const [basicConfig, setBasicConfig] = useState({
    to: to || (type === TIM.TYPES.CONV_C2C ? userProfile?.userID : groupProfile?.groupID),
    conversationType: type,
    cloudCustomData,
  });

  useEffect(() => {
    basicConfig.cloudCustomData = cloudCustomData;
    setBasicConfig(basicConfig);
  }, [cloudCustomData]);

  const createTextMessage = useCallback((params: CreateTextMessageProps) => tim.createTextMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createFaceMessage = useCallback((params: CreateFaceMessageProps) => tim.createFaceMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createImageMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => tim.createImageMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createVideoMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => tim.createVideoMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createFileMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => tim.createFileMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createForwardMessage = useCallback((
    params: CreateForwardMessageProps,
  ) => {
    const { conversation: forwardConversation, message, ...other } = params;
    const {
      type: forwardType,
      userProfile: forwardUserProfile,
      groupProfile: forwardGroupProfile,
    } = forwardConversation;
    const forwardTo = forwardType === TIM.TYPES.CONV_C2C
      ? forwardUserProfile?.userID : forwardGroupProfile?.groupID;
    return tim.createForwardMessage({
      to: forwardTo,
      conversationType: forwardType,
      payload: message,
      ...other,
    });
  }, [tim]);

  const createCustomMessage = useCallback((
    params: CreateCustomMessageProps,
    // ChatSDK < V2.26.0 createCustomMessage ts declaration error
  ) => (tim as any).createCustomMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createAudioMessage = useCallback((
    params: CreateUploadMessageProps,
  ) => tim.createAudioMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createTextAtMessage = useCallback((
    params: CreateTextAtMessageProps,
  ) => tim.createTextAtMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createLocationMessage = useCallback((
    params: CreateLocationMessageProps,
  ) => tim.createLocationMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

  const createMergerMessage = useCallback((
    params: CreateMergerMessageProps,
  ) => tim.createMergerMessage({
    ...basicConfig,
    ...params,
  }), [tim]);

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
