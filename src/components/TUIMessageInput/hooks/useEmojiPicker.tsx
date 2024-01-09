import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTUIChatActionContext } from '../../../context';
import { emojiEnKey } from '../../TUIMessage/utils/emojiMap';
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

  const { i18n } = useTranslation();
  const { sendMessage, createFaceMessage } = useTUIChatActionContext('useEmojiPicker');

  const onSelectEmoji = (emoji:EmojiData) => {
    if (i18n.language === 'zh') {
      insertText(emoji.data);
    } else {
      insertText(emojiEnKey[emoji.data]);
    }
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
