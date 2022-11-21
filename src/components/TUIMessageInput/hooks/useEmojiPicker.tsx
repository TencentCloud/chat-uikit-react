import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react';
import { useTUIChatActionContext } from '../../../context';
import type { IbaseStateProps } from './useMessageInputState';

export interface EmojiData {
  index: number,
  data: string,
}

interface useEmojiPickerProps extends IbaseStateProps {
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  insertText?: (textToInsert: string) => void
}

export function useEmojiPicker<T extends useEmojiPickerProps>(props:PropsWithChildren<T>) {
  const {
    textareaRef,
    insertText,
  } = props;

  const { sendMessage, createFaceMessage } = useTUIChatActionContext('useEmojiPicker');

  const onSelectEmoji = (emoji:EmojiData) => {
    insertText(emoji.data);
  };

  const sendFaceMessage = useCallback((emoji:EmojiData) => {
    const message = createFaceMessage({
      payload: emoji,
    });
    sendMessage(message);
  }, []);

  return {
    onSelectEmoji,
    sendFaceMessage,
  };
}
