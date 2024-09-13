import type { Reducer } from 'react';
import { Conversation, Message } from '@tencentcloud/chat';
import { IMessageModel } from '@tencentcloud/chat-uikit-engine';
import { CONSTANT_DISPATCH_TYPE } from '../../constants';
import type { TUIChatStateContextValue } from '../../context';
import { OperateMessageParams } from './hooks/useHandleMessage';
import {
  handleEditMessage,
  handleUploadPendingMessage,
} from './utils';

export type ChatStateReducerAction =
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_CONVERSATION_PRPFILE;
    value?: Conversation;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST;
    value?: IMessageModel[];
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE;
    value?: Message;
    index?: number;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_IS_COMPLETE;
    value?: boolean;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.RESET;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID;
    value?: string;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE;
    value?: OperateMessageParams;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_NO_MORE;
    value?: boolean;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE;
    value?: HTMLAudioElement | null;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE;
    value?: HTMLVideoElement | null;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.UPDATE_UPLOAD_PENDING_MESSAGE_LIST;
    value?: Message;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_FIRST_SEND_MESSAGE;
    value?: Message;
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_ACTIVE_MESSAGE_ID;
    value?: string;
  };
export type ChatStateReducer = Reducer<TUIChatStateContextValue, ChatStateReducerAction>;

export const chatReducer = (
  state: TUIChatStateContextValue,
  action: ChatStateReducerAction,
) => {
  switch (action?.type) {
    case CONSTANT_DISPATCH_TYPE.SET_CONVERSATION_PRPFILE:
      return { ...state, conversation: action.value };
    // messageList set
    case CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST:
      return {
        ...state,
        messageList: action.value,
      };
    case CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE:
      return state.messageList && action.value && {
        ...state,
        messageList: [...handleEditMessage(state.messageList, action.value)],
      };
    case CONSTANT_DISPATCH_TYPE.SET_IS_COMPLETE:
      return { ...state, isCompleted: action.value };
    case CONSTANT_DISPATCH_TYPE.RESET:
      return { ...initialState };
    case CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID:
      return { ...state, highlightedMessageId: action.value };
    case CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE:
      return { ...state, operateData: { ...action.value } };
    case CONSTANT_DISPATCH_TYPE.SET_NO_MORE:
      return { ...state, noMore: action.value };
    case CONSTANT_DISPATCH_TYPE.SET_AUDIO_SOURCE:
      return { ...state, audioSource: action.value };
    case CONSTANT_DISPATCH_TYPE.SET_VIDEO_SOURCE:
      return { ...state, vidoeSource: action.value };
    case CONSTANT_DISPATCH_TYPE.UPDATE_UPLOAD_PENDING_MESSAGE_LIST:
      return state?.uploadPendingMessageList && action.value && {
        ...state,
        uploadPendingMessageList: [
          ...handleUploadPendingMessage(state.uploadPendingMessageList, action.value),
        ],
      };
    case CONSTANT_DISPATCH_TYPE.SET_FIRST_SEND_MESSAGE:
      return { ...state, firstSendMessage: action.value };
    case CONSTANT_DISPATCH_TYPE.SET_ACTIVE_MESSAGE_ID:
      return { ...state, activeMessageID: action.value };
  }
};

export const initialState: TUIChatStateContextValue = {
  conversation: {} as Conversation,
  messageList: [],
  nextReqMessageID: '',
  isCompleted: false,
  init: false,
  highlightedMessageId: '',
  lastMessageID: '',
  isSameLastMessageID: false,
  operateData: {},
  noMore: false,
  audioSource: null,
  vidoeSource: null,
  uploadPendingMessageList: [],
  firstSendMessage: null,
  activeMessageID: '',
};
