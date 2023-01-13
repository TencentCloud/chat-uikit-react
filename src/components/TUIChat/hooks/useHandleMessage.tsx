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

  const setAudioSource = useCallback((data: HTMLAudioElement | null) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE,
      value: data,
    });
  }, [dispatch]);

  const setVideoSource = useCallback((data: HTMLVideoElement | null) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE,
      value: data,
    });
  }, [dispatch]);

  const setHighlightedMessageId = useCallback((highlightedMessageId: string) => {
    dispatch({
      type: CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID,
      value: highlightedMessageId,
    });
  }, [dispatch]);

  return {
    operateMessage,
    setAudioSource,
    setVideoSource,
    setHighlightedMessageId,
  };
}
