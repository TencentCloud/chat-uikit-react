import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { TUIChatService } from '@tencentcloud/chat-uikit-engine';
import { emojiEnKey } from '../../MessageElement/utils/emojiMap';
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

  const onSelectEmoji = (emoji:EmojiData) => {
    if (i18n.language === 'zh-CN') {
      insertText && insertText(emoji.data);
    } else {
      insertText && insertText(emojiEnKey[emoji.data]);
    }
  };

  const sendFaceMessage = useCallback((emoji:EmojiData) => {
    TUIChatService.sendFaceMessage({ payload: emoji });
  }, []);

  return {
    onSelectEmoji,
    sendFaceMessage,
  };
}
