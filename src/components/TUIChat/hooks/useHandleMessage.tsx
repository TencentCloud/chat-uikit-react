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
export interface OperateMessageParams {
  [propName: string]: Message,
}

export function useHandleMessage<T extends CreateMessageProps>(props:T) {
  const {
    state,
    dispatch,
  } = props;

  const operateMessage = useCallback((data: OperateMessageParams) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE,
      value: data,
    });
  }, [dispatch]);

  return {
    operateMessage,
  };
}
