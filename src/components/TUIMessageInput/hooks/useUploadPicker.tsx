import {
  PropsWithChildren,
  useCallback,
} from 'react';
import { MESSAGE_TYPE_NAME } from '../../../constants';
import { useTUIChatActionContext } from '../../../context';
import type { IbaseStateProps } from './useMessageInputState';

export interface filesData {
  file: HTMLInputElement | File
}

export function useUploadPicker<T extends IbaseStateProps>(props:PropsWithChildren<T>) {
  const {
    sendMessage,
    createImageMessage,
    createVideoMessage,
    createFileMessage,
  } = useTUIChatActionContext('useUploadPicker');

  const creatUploadMessage = {
    [MESSAGE_TYPE_NAME.IMAGE]: createImageMessage,
    [MESSAGE_TYPE_NAME.VIDEO]: createVideoMessage,
    [MESSAGE_TYPE_NAME.FILE]: createFileMessage,
  };

  const sendUploadMessage = useCallback((file: filesData, type:MESSAGE_TYPE_NAME) => {
    const message = creatUploadMessage[type]({
      payload: file,
      onProgress(num:number) {
        message.progress = num;
      },
    });
    sendMessage(message);
  }, [sendMessage]);

  return {
    sendUploadMessage,
  };
}
