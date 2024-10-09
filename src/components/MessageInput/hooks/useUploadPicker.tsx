import {
  PropsWithChildren,
  useCallback,
} from 'react';
import {
  TUIChatService,
} from '@tencentcloud/chat-uikit-engine';
import { MESSAGE_TYPE_NAME } from '../../../constants';
import { enableSampleTaskStatus } from '../../utils';
import { useTUIChatActionContext } from '../../../context';
import type { IbaseStateProps } from './useMessageInputState';

export interface filesData {
  file: HTMLInputElement | File;
}

export function useUploadPicker<T extends IbaseStateProps>(props: PropsWithChildren<T>) {
  const {
    updateUploadPendingMessageList,
  } = useTUIChatActionContext('useUploadPicker');

  const creatUploadMessage: any = {
    [MESSAGE_TYPE_NAME.IMAGE]: TUIChatService.sendImageMessage,
    [MESSAGE_TYPE_NAME.VIDEO]: TUIChatService.sendVideoMessage,
    [MESSAGE_TYPE_NAME.FILE]: TUIChatService.sendFileMessage,
  };

  const sendUploadMessage = useCallback((file: filesData, type: MESSAGE_TYPE_NAME) => {
    creatUploadMessage[type]({
      payload: file,
    });
    enableSampleTaskStatus('sendMessage');
  }, []);

  return {
    sendUploadMessage,
  };
}
