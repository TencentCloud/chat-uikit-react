import { Dispatch, useCallback } from 'react';
import TencentCloudChat, { ChatSDK, Conversation, Message } from '@tencentcloud/chat';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { TUIChatStateContextValue } from '../../../context';
import type { ChatStateReducerAction } from '../TUIChatState';

export interface CreateMessageProps {
  chat?: ChatSDK,
  conversation?: Conversation,
  state?: TUIChatStateContextValue,
  dispatch?: Dispatch<ChatStateReducerAction>,
}

export interface GetMessageListProps{
  nextReqMessageID?: string,
  count?: number,
}

export function useHandleMessageList<T extends CreateMessageProps>(props:T) {
  const {
    chat,
    conversation,
    state,
    dispatch,
  } = props;

  const { conversationID, groupProfile, type } = conversation;
  const isC2CConversation = type === TencentCloudChat.TYPES.CONV_C2C;

  const basicConfig = {
    conversationID,
  };

  const getMessageList = useCallback(async (params?: GetMessageListProps) => {
    const data = params || {};
    let groupType;
    if (groupProfile) {
      groupType = groupProfile.type;
    }
    if (isC2CConversation || (groupType !== TencentCloudChat.TYPES.GRP_AVCHATROOM)) {
      return chat.getMessageList({
        ...basicConfig,
        ...data,
      });
    }
    return null;
  }, [chat]);

  const updateMessage = useCallback((messageList: Array<Message>) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_UPDATE_MESSAGE,
      value: messageList.filter((item) => (
        item?.conversationID === conversationID
      )),
    });
  }, [dispatch]);

  const removeMessage = useCallback((message: Message) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_REMOVE_MESSAGE,
      value: message,
    });
  }, [dispatch]);

  const editLocalMessage = useCallback((message: Message) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE,
      value: message,
    });
  }, [dispatch]);

  const updateUploadPendingMessageList = useCallback((message: Message) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.UPDATE_UPLOAD_PENDING_MESSAGE_LIST,
      value: message,
    });
  }, [dispatch]);

  return {
    getMessageList,
    updateMessage,
    removeMessage,
    editLocalMessage,
    updateUploadPendingMessageList,
  };
}
