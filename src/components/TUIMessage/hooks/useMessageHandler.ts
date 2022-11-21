import { useCallback } from 'react';
import { Message } from 'tim-js-sdk';
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
    editLocalmessage,
    operateMessage,
    revokeMessage,
  } = useTUIChatActionContext('useDeleteHandler');
  const { tim } = useTUIKitContext('useDeleteHandler');

  const handleDelMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.ID || !tim || !removeMessage) {
      return;
    }

    try {
      await tim.deleteMessage([message]);
      removeMessage(message);
    } catch (error) {
      if (handleError) {
        handleError({
          functionName: 'deleteMessage',
          error,
        });
      } else {
        Toast({ text: 'Error deleting message', type: 'error' });
        throw new Error(error);
      }
    }
  }, [message]);

  const handleRevokeMessage = useCallback(async (event?) => {
    event.preventDefault();
    if (!message?.ID || !tim || !editLocalmessage) {
      return;
    }

    try {
      if (revokeMessage) {
        await revokeMessage(message);
      } else {
        await tim.revokeMessage(message);
      }
      editLocalmessage(message);
    } catch (error) {
      if (handleError) {
        handleError({
          functionName: 'revokeMessage',
          error,
        });
      } else {
        const text = message.flow === MESSAGE_FLOW.OUT ? 'The message recall exceeded the time limit (default 2 minutes)' : 'Error revoke Message';
        Toast({ text, type: 'error' });
        throw new Error(error);
      }
    }
  }, [message]);

  const handleReplyMessage = useCallback((event?) => {
    event.preventDefault();
    if (!message?.ID || !tim || !operateMessage) {
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
      const res = await tim.resendMessage(message);
      editLocalmessage(res?.data?.message);
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
    if (!message?.ID || !tim || !operateMessage) {
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
