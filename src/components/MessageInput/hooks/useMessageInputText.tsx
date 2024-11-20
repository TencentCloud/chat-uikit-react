import React, {
  useCallback,
  ChangeEventHandler,
  MutableRefObject,
} from 'react';
import {
  TUIChatService,
} from '@tencentcloud/chat-uikit-engine';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { CONSTANT_DISPATCH_TYPE, MESSAGE_OPERATE, MESSAGE_TYPE_NAME } from '../../../constants';
import {
  useTUIChatActionContext,
} from '../../../context';
import { useUIManagerStore } from '../../../store';
import { enableSampleTaskStatus } from '../../utils';
import { useHandleQuoteMessage } from './useHandleQuoteMessage';
import { transformTextWithEmojiNameToKey } from '../../MessageElement/utils/decodeText';
import type { IbaseStateProps, ICursorPos } from './useMessageInputState';
import { filesData } from './useUploadPicker';

interface useMessageInputTextProps extends IbaseStateProps {
  focus?: boolean;
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  sendUploadMessage?: (file: filesData, type: MESSAGE_TYPE_NAME) => void;
}

export const useMessageInputText = (props: useMessageInputTextProps) => {
  const {
    state,
    dispatch,
    focus,
    textareaRef,
    sendUploadMessage,
  } = props;

  const { t } = useUIKit();
  const { chat } = useUIManagerStore();
  const { operateMessage, setFirstSendMessage } = useTUIChatActionContext('TUIMessageInput');

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
        getNewText: (text: string) => event.target.value,
      });
    },
    [chat],
  );

  const handleSubmit = async (
    event?: React.BaseSyntheticEvent,
  ) => {
    event?.preventDefault();
    if (!state.text) {
      return;
    }
    const options: any = {
      payload: {
        text: transformTextWithEmojiNameToKey(state.text),
      },
    };
    if (cloudCustomData.messageReply) {
      options.cloudCustomData = JSON.stringify(cloudCustomData);
    }
    TUIChatService.sendTextMessage(options).then((res: any) => {
      const { message } = res.data;
      setFirstSendMessage && setFirstSendMessage(message);
    });
    enableSampleTaskStatus('sendMessage');
    dispatch({
      getNewText: (text: string) => '',
      type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
    });
    operateMessage && operateMessage({
      // eslint-disable-next-line
      // @ts-ignore
      [MESSAGE_OPERATE.QUOTE]: null,
    });
  };

  const handleKeyDown = useCallback(
    (event?: React.KeyboardEvent<EventTarget>) => {
      if (!event?.ctrlKey && event?.code && enterCodeList.indexOf(event?.code) > -1 && event.key === 'Enter') {
        event?.preventDefault();
        handleSubmit(event);
      }
      if (event?.ctrlKey && enterCodeList.indexOf(event?.code) > -1 && event.key === 'Enter') {
        dispatch({
          type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
          getNewText: (text: string) => `${text}\n`,
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
      types.find((type: string, index: number) => {
        const item = items[index];
        switch (type) {
          case 'text/plain':
            item.getAsString((str: string) => {
              dispatch({
                type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
                getNewText: (text: string) => `${text}${str}`,
              });
            });
            return true;
          case 'Files': {
            const file = item.getAsFile();
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
              sendUploadMessage && sendUploadMessage({ file }, MESSAGE_TYPE_NAME.IMAGE);
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
      const insertEmojiName = t(`Emoji.${textToInsert}`) || '';
      const cursorStart = state.cursorPos?.start || 0;
      const cursorEnd = state.cursorPos?.end || 0;
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_TEXT,
        getNewText: (text: string) => {
          return `${text.slice(0, cursorStart)}${insertEmojiName}${text.slice(cursorStart)}`;
        },
      });
      dispatch({
        type: CONSTANT_DISPATCH_TYPE.SET_CURSOR_POS,
        value: {
          start: cursorStart + insertEmojiName.length,
          end: cursorEnd + insertEmojiName.length,
        },
      });
      textareaRef?.current?.focus({
        preventScroll: true,
      });
    },
    [textareaRef, state.cursorPos],
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
