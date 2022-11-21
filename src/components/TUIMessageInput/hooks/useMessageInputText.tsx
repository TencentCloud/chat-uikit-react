import React, {
  useCallback,
  ChangeEventHandler,
  MutableRefObject,
  useEffect,
  useState,
} from 'react';
import { CONSTANT_DISPATCH_TYPE, MESSAGE_OPERATE } from '../../../constants';
import {
  useTUIChatActionContext,
  useTUIChatStateContext,
  useTUIKitContext,
} from '../../../context';
import { useHandleQuoteMessage } from './useHandleQuoteMessage';
import type { IbaseStateProps, ICursorPos } from './useMessageInputState';

interface useMessageInputTextProps extends IbaseStateProps {
  focus?: boolean,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
}

export const useMessageInputText = (props:useMessageInputTextProps) => {
  const {
    state,
    dispatch,
    focus,
    textareaRef,
  } = props;

  const [quoteMessage, setQuoteMessage] = useState(null);

  const { tim } = useTUIKitContext('useMessageInputText');
  const { sendMessage, createTextMessage, operateMessage } = useTUIChatActionContext('TUIMessageInput');
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  useEffect(() => {
    setQuoteMessage(operateData[MESSAGE_OPERATE.QUOTE]);
  }, [operateData]);

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
        text: state.text,
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
    async (e: ClipboardEvent) => {
      e.preventDefault();
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      const str = e.clipboardData.getData('text');
      if (str) {
        dispatch({
          type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
          getNewText: (text:string) => `${text}${str}`,
        });
      }
      //  else {
      //   for (let i = 0; i < e.clipboardData.items.length; i += 1) {
      //     const item = e.clipboardData.items[i];
      //     if (item.kind === 'file') {
      //       const f = item.getAsFile();
      //       console.log('file', f);
      //     }
      //   }
      // }
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
