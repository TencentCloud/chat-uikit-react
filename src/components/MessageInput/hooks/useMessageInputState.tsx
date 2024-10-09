import { Dispatch, useReducer } from 'react';
import { CONSTANT_DISPATCH_TYPE } from '../../../constants';
import type { TUIMessageInputProps } from '../MessageInput';
import { useEmojiPicker } from './useEmojiPicker';
import { useMessageInputText } from './useMessageInputText';
import { useUploadPicker } from './useUploadPicker';

export interface IbaseStateProps {
  state: IinitState,
  dispatch: Dispatch<MessageInputReducerAction>,
}

export interface IinitState {
  text?: string,
  cursorPos?: ICursorPos,
}

export interface ICursorPos {
  start?: number | null,
  end?: number | null,
}

export type MessageInputReducerAction =
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_TEXT;
    getNewText: (text: string) => void,
  }
  | {
    type: CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS;
    value: ICursorPos
  }

const initState:IinitState = {
  text: '',
  cursorPos: {
    start: 0,
    end: 0,
  },
};

const reducer = (state:IinitState, action: any) => {
  switch (action.type) {
    case CONSTANT_DISPATCH_TYPE.SET_TEXT:
      return { ...state, text: action?.getNewText(state.text) };
    case CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS:
      return { ...state, cursorPos: action?.value };
    default: return state;
  }
};

export const useMessageInputState = (props:TUIMessageInputProps) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { focus, textareaRef } = props;

  const {
    sendUploadMessage,
  } = useUploadPicker({
    state,
    dispatch,
  });
  const {
    handleChange,
    handleSubmit,
    handleKeyDown,
    handlePasete,
    insertText,
    setText,
    setCursorPos,
  } = useMessageInputText({
    state,
    dispatch,
    textareaRef,
    focus,
    sendUploadMessage,
  });

  const {
    onSelectEmoji,
    sendFaceMessage,
  } = useEmojiPicker({
    state,
    dispatch,
    textareaRef,
    insertText,
  });

  return {
    ...state,
    handleChange,
    handleSubmit,
    handleKeyDown,
    handlePasete,
    onSelectEmoji,
    sendFaceMessage,
    sendUploadMessage,
    textareaRef,
    insertText,
    setText,
    focus,
    setCursorPos,
  };
};
