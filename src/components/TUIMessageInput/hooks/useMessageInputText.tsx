import React, {
  useCallback,
  ChangeEventHandler,
  MutableRefObject,
} from 'react';
import { CONSTANT_DISPATCH_TYPE, MESSAGE_OPERATE, MESSAGE_TYPE_NAME } from '../../../constants';
import {
  useTUIChatActionContext,
  useTUIKitContext,
} from '../../../context';
import { formatEmojiString } from '../../TUIMessage/utils/emojiMap';
import { useHandleQuoteMessage } from './useHandleQuoteMessage';
import type { IbaseStateProps, ICursorPos } from './useMessageInputState';
import { filesData } from './useUploadPicker';

interface useMessageInputTextProps extends IbaseStateProps {
  focus?: boolean,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  sendUploadMessage?: (file: filesData, type: MESSAGE_TYPE_NAME) => void
}

export const useMessageInputText = (props:useMessageInputTextProps) => {
  const {
    state,
    dispatch,
    focus,
    textareaRef,
    sendUploadMessage,
  } = props;

  const { tim } = useTUIKitContext('useMessageInputText');
  const { sendMessage, createTextMessage, operateMessage } = useTUIChatActionContext('TUIMessageInput');

  const { cloudCustomData } = useHandleQuoteMessage();

  const enterCodeList = ['Enter', 'NumpadEnter'];

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (!event || !event.target) {
        return;
      }
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        getNewText: (text:string) => event.target.value,
      });
    },
    [tim],
  );

  const handleSubmit = async (
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault();
    if (!state.text) {
      return;
    }
    const options:any = {
      payload: {
        text: formatEmojiString(state.text),
      },
    };
    if (cloudCustomData.messageReply) {
      options.cloudCustomData = JSON.stringify(cloudCustomData);
    }
    const message = createTextMessage(options);
    await sendMessage(message);
    dispatch({
      getNewText: (text:string) => '',
      type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
    });
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: null,
    });
  };

  const handleKeyDown = useCallback(
    (event?:React.KeyboardEvent<EventTarget>) => {
      if (!event?.ctrlKey && enterCodeList.indexOf(event?.code) > -1 && event.keyCode === 13) {
        event?.preventDefault();
        handleSubmit(event);
      }
      if (event?.ctrlKey && enterCodeList.indexOf(event?.code) > -1 && event.keyCode === 13) {
        dispatch({
          type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
          getNewText: (text:string) => `${text}\n`,
        });
      }
    },
    [handleSubmit, dispatch],
  );

  const handlePasete = useCallback(
    async (e: React.ClipboardEvent | any) => {
      e.preventDefault();
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      const { types, items } = e.clipboardData;
      types.find((type, index) => {
        const item = items[index];
        switch (type) {
          case 'text/plain':
            item.getAsString((str) => {
              dispatch({
                type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
                getNewText: (text:string) => `${text}${str}`,
              });
            });
            return true;
          case 'Files': {
            const file = item.getAsFile();
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
              sendUploadMessage({ file }, MESSAGE_TYPE_NAME.IMAGE);
            }
            return true;
          }
          default:
            return false;
        }
      });
    },
    [textareaRef],
  );

  const insertText = useCallback(
    (textToInsert: string) => {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        getNewText: (text:string) => `${text.slice(0, state.cursorPos.start)}${textToInsert}${text.slice(state.cursorPos.start)}`,
      });
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS,
        value: {
          start: state.cursorPos.start + textToInsert.length,
          end: state.cursorPos.end + textToInsert.length,
        },
      });
      textareaRef?.current?.focus();
    },
    [textareaRef, state],
  );

  const setText = useCallback(
    (textToInsert: string) => {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        getNewText: () => `${textToInsert}`,
      });
      textareaRef?.current?.focus();
    },
    [textareaRef],
  );

  const setCursorPos = useCallback(
    (cursorPos: ICursorPos) => {
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS,
        value: cursorPos,
      });
    },
    [textareaRef],
  );

  return {
    handleChange,
    handleSubmit,
    handleKeyDown,
    handlePasete,
    insertText,
    setText,
    setCursorPos,
  };
};
