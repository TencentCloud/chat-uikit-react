import { Dispatch, useCallback } from 'react';
import TencentCloudChat, { ChatSDK, Conversation, Message } from '@tencentcloud/chat';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { TUIChatStateContextValue } from '../../../context';
import type { ChatStateReducerAction } from '../ChatState';

export interface CreateMessageProps {
  chat?: ChatSDK,
  conversation?: Conversation,
  state?: TUIChatStateContextValue,
  dispatch?: Dispatch<ChatStateReducerAction>,
  filterMessage: any
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
    filterMessage,
  } = props;

  const editLocalMessage = useCallback((message: Message) => {
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE,
      value: message,
    });
  }, [dispatch]);

  const updateUploadPendingMessageList = useCallback((message: Message) => {
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.UPDATE_UPLOAD_PENDING_MESSAGE_LIST,
      value: message,
    });
  }, [dispatch]);

  return {
    editLocalMessage,
    updateUploadPendingMessageList,
  };
}
