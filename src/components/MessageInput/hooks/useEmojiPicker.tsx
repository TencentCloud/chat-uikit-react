import {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { TUIChatService } from '@tencentcloud/chat-uikit-engine';
import type { IbaseStateProps } from './useMessageInputState';

export interface EmojiData {
  index: number;
  data: string;
}

interface useEmojiPickerProps extends IbaseStateProps {
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  insertText?: (textToInsert: string) => void;
}

export function useEmojiPicker<T extends useEmojiPickerProps>(props: PropsWithChildren<T>) {
  const {
    textareaRef,
    insertText,
  } = props;

  const { language } = useUIKit();

  const onSelectEmoji = useCallback((emoji: EmojiData) => {
    insertText && insertText(emoji.data);
  }, [insertText, language]);

  const sendFaceMessage = useCallback((emoji: EmojiData) => {
    TUIChatService.sendFaceMessage({ payload: emoji });
  }, []);

  return {
    onSelectEmoji,
    sendFaceMessage,
  };
}
