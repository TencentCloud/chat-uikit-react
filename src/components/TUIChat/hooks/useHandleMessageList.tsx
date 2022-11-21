import { Dispatch, useCallback } from 'react';
import { ChatSDK, Conversation, Message } from 'tim-js-sdk';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { TUIChatStateContextValue } from '../../../context';
import type { ChatStateReducerAction } from '../TUIChatState';

export interface CreateMessageProps {
  tim?: ChatSDK,
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
    tim,
    conversation,
    state,
    dispatch,
  } = props;

  const { conversationID } = conversation;

  const basicConfig = {
    conversationID,
  };

  const getMessageList = useCallback((params?: GetMessageListProps) => {
    const data = params || {};
    return tim.getMessageList({
      ...basicConfig,
      ...data,
    });
  }, [tim]);

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

  const editLocalmessage = useCallback((message: Message) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE,
      value: message,
    });
  }, [dispatch]);

  return {
    getMessageList,
    updateMessage,
    removeMessage,
    editLocalmessage,
  };
}
