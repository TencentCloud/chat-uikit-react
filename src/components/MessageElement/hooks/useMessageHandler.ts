import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '@tencentcloud/chat';
import { TUIStore } from '@tencentcloud/chat-uikit-engine';
import { CONSTANT_DISPATCH_TYPE, MESSAGE_FLOW, MESSAGE_OPERATE } from '../../../constants';
import { enableSampleTaskStatus } from '../../utils';
import { useTUIChatActionContext, useUIKit } from '../../../context';
import { Toast } from '../../Toast';

interface MessageHandlerProps {
  handleError?: (error: any) => void;
  message?: Message;
}

export const useMessageHandler = (props: MessageHandlerProps) => {
  const {
    message,
    handleError,
  } = props;

  const {
    editLocalMessage,
    operateMessage,
    revokeMessage,
  } = useTUIChatActionContext('useDeleteHandler');
  const { t } = useTranslation();
  const { chat } = useUIKit('useDeleteHandler');

  const handleDelMessage = useCallback(async (event?: any) => {
    event.preventDefault();
    if (!message) return;
    const messageModel = TUIStore.getMessageModel(message?.ID);
    messageModel.deleteMessage();
  }, [message]);

  const handleRevokeMessage = useCallback(async (event?: any) => {
    event.preventDefault();
    if (!message) return;
    const messageModel = TUIStore.getMessageModel(message?.ID);
    messageModel.revokeMessage().then(() => {
      editLocalMessage && editLocalMessage(message);
      enableSampleTaskStatus('revokeMessage');
    }).catch((error: any) => {
      if (handleError) {
        handleError({
          functionName: 'revokeMessage',
          error,
        });
      } else {
        const text = message.flow === MESSAGE_FLOW.OUT ? t('TUIChat.The message recall exceeded the time limit (default 2 minutes)') : t('TUIChat.Error revoke Message');
        Toast({ text, type: 'error' });
        throw new Error(error);
      }
    });
  }, [message]);

  const handleReplyMessage = useCallback((event?: any) => {
    event.preventDefault();
    if (!message?.ID || !chat || !operateMessage) {
      return;
    }
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: message,
    });
  }, [message]);

  const handleCopyMessage = useCallback((event?: any) => {
    event.preventDefault();
    if (navigator.clipboard) {
      // clipboard api
      navigator.clipboard.writeText(message?.payload.text);
    } else {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      // hide textarea
      textarea.style.position = 'fixed';
      textarea.style.clip = 'rect(0 0 0 0)';
      textarea.style.top = '10px';
      textarea.value = message?.payload.text;
      // select
      textarea.select();
      // copy
      document.execCommand('copy', true);
      // remove textarea
      document.body.removeChild(textarea);
    }
  }, [message]);

  const handleResendMessage = useCallback(async () => {
    try {
      const res = message && await chat.resendMessage(message);
      editLocalMessage && editLocalMessage(res?.data?.message);
    } catch (error: any) {
      if (handleError) {
        handleError({
          functionName: 'resendMessage',
          error,
        });
      } else {
        Toast({ text: error, type: 'error' });
        throw new Error(error);
      }
    }
  }, [message]);

  const handleForWardMessage = useCallback(async (event?: any) => {
    event.preventDefault();
    if (!message?.ID || !chat || !operateMessage) {
      return;
    }
    operateMessage({
      [MESSAGE_OPERATE.FORWARD]: message,
    });
  }, [message]);

  return {
    handleDelMessage,
    handleRevokeMessage,
    handleReplyMessage,
    handleCopyMessage,
    handleResendMessage,
    handleForWardMessage,
  };
};
