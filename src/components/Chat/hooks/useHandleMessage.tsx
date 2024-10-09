import { Dispatch, useCallback } from 'react';
import { ChatSDK, Conversation, Message } from '@tencentcloud/chat';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { TUIChatStateContextValue } from '../../../context';
import type { ChatStateReducerAction } from '../ChatState';

export interface CreateMessageProps {
  chat?: ChatSDK,
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
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE,
      value: data,
    });
  }, [dispatch]);

  const setAudioSource = useCallback((data: HTMLAudioElement | null) => {
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE,
      value: data,
    });
  }, [dispatch]);

  const setVideoSource = useCallback((data: HTMLVideoElement | null) => {
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE,
      value: data,
    });
  }, [dispatch]);

  const setHighlightedMessageId = useCallback((highlightedMessageId: string) => {
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID,
      value: highlightedMessageId,
    });
  }, [dispatch]);

  const setActiveMessageID = useCallback((messageID: string) => {
    dispatch && dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_ACTIVE_MESSAGE_ID,
      value: messageID,
    });
  }, [dispatch]);

  return {
    operateMessage,
    setAudioSource,
    setVideoSource,
    setHighlightedMessageId,
    setActiveMessageID,
  };
}
