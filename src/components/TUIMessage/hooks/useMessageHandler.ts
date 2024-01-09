import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '@tencentcloud/chat';
import { MESSAGE_FLOW, MESSAGE_OPERATE } from '../../../constants';
import { useTUIChatActionContext, useTUIKitContext } from '../../../context';
import { Toast } from '../../Toast';

interface MessageHandlerProps {
  handleError?: (error) => void,
  message?: Message,
}

export const useMessageHandler = (props?: MessageHandlerProps) => {
  const {
    message,
    handleError,
  } = props;

  const {
    removeMessage,
    editLocalMessage,
    operateMessage,
    revokeMessage,
  } = useTUIChatActionContext('useDeleteHandler');
  const { t } = useTranslation();
  const { chat } = useTUIKitContext('useDeleteHandler');

  const handleDelMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.ID || !chat || !removeMessage) {
      return;
    }

    try {
      await chat.deleteMessage([message]);
      removeMessage(message);
    } catch (error) {
      if (handleError) {
        handleError({
          functionName: 'deleteMessage',
          error,
        });
      } else {
        Toast({ text: t('TUIChat.Error deleting message'), type: 'error' });
        throw new Error(error);
      }
    }
  }, [message]);

  const handleRevokeMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.ID || !chat || !editLocalMessage) {
      return;
    }

    try {
      if (revokeMessage) {
        await revokeMessage(message);
      } else {
        await chat.revokeMessage(message);
      }
      editLocalMessage(message);
    } catch (error) {
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
    }
  }, [message]);

  const handleReplyMessage = useCallback((event?) => {
    event.preventDefault();
    if (!message?.ID || !chat || !operateMessage) {
      return;
    }
    operateMessage({
      [MESSAGE_OPERATE.QUOTE]: message,
    });
  }, [message]);

  const handleCopyMessage = useCallback((event?) => {
    event.preventDefault();
    if (navigator.clipboard) {
      // clipboard api
      navigator.clipboard.writeText(message.payload.text);
    } else {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      // hide textarea
      textarea.style.position = 'fixed';
      textarea.style.clip = 'rect(0 0 0 0)';
      textarea.style.top = '10px';
      textarea.value = message.payload.text;
      // select
      textarea.select();
      // copy
      document.execCommand('copy', true);
      // remove textarea
      document.body.removeChild(textarea);
    }
  }, [message]);

  const handleResendMessage = useCallback(async (event?) => {
    try {
      const res = await chat.resendMessage(message);
      editLocalMessage(res?.data?.message);
    } catch (error) {
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

  const handleForWardMessage = useCallback(async (event?) => {
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
