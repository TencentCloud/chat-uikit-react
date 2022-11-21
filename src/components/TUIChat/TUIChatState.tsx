import type { Reducer } from 'react';
import { Conversation, Message } from 'tim-js-sdk';
import { CONSTANT_DISPATCH_TYPE } from '../../constants';
import type { TUIChatStateContextValue } from '../../context';
import { OperateMessageParams } from './hooks/useHandleMessage';
import {
  handleMessage,
  handleMessageList,
  handleEditMessage,
  handleRemoveMessage,
} from './unitls';

export type ChatStateReducerAction =
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_CONVERSATION_PRPFILE;
      value?: Conversation
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST,
      value?: Array<Message>,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_UPDATE_MESSAGE,
      value?: Array<Message>,
      index?: number
    }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE,
    value?: Message,
    index?: number,
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_REMOVE_MESSAGE,
    value?: Message
  }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_HISTORY_MESSAGELIST,
      value?: Array<Message>,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_NEXT_REQ_MESSAGE_ID,
      value?: string,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_IS_COMPLETE,
      value?: boolean,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.RESET;
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_HIGH_LIGHTED_MESSAGE_ID,
      value?: string,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.OPERATE_MESSAGE,
      value?: OperateMessageParams,
    }
  | {
      type: CONSTANT_DISPATCH_TYPE.SET_NO_MORE,
      value?: boolean,
    }
export type ChatStateReducer = Reducer<TUIChatStateContextValue, ChatStateReducerAction>;

export const chatReducer = (
  state: TUIChatStateContextValue,
  action: ChatStateReducerAction,
) => {
  switch (action?.type) {
    case CONSTANT_DISPATCH_TYPE.SET_CONVERSATION_PRPFILE:
      return { ...state, conversation: action.value };
    case CONSTANT_DISPATCH_TYPE.SET_MESSAGELIST:
      return {
        ...state,
        ...handleMessageList(
          [...state.messageList.concat(
            handleMessage(action.value).filter((item) => !state.messageList.includes(item)),
          )],
          state,
        ),
      };
    case CONSTANT_DISPATCH_TYPE.SET_UPDATE_MESSAGE:
      return {
        ...state,
        ...handleMessageList([...state.messageList, ...handleMessage(action.value)], state),
      };
    case CONSTANT_DISPATCH_TYPE.SET_EDIT_MESSAGE:
      return {
        ...state,
        messageList: [...handleEditMessage(state.messageList, action.value)],
      };
    case CONSTANT_DISPATCH_TYPE.SET_REMOVE_MESSAGE:
      return {
        ...state,
        messageList: [...handleRemoveMessage(state.messageList, action.value)],
      };
    case CONSTANT_DISPATCH_TYPE.SET_HISTORY_MESSAGELIST:
      return {
        ...state,
        ...handleMessageList([...handleMessage(action.value), ...state.messageList], state),
      };
    case CONSTANT_DISPATCH_TYPE.SET_NEXT_REQ_MESSAGE_ID:
      return { ...state, nextReqMessageID: action.value };
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
    default: return state;
  }
};

export const initialState:TUIChatStateContextValue = {
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
};
