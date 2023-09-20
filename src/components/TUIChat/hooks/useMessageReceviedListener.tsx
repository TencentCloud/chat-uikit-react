import { useEffect } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
import { useTUIKitContext } from '../../../context';

export function useMessageReceviedListener(
  setMessageList:(event?: Array<Message>) => void,
  customHandler?: (
    updateMessage: (event?: Array<Message>) => void,
    event: any,
  ) => void,
) {
  const { chat } = useTUIKitContext('useMessageReceviedListener');
  useEffect(() => {
    const handleMessageRecevied = (event: any) => {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setMessageList, event);
      } else {
        setMessageList(event.data);
      }
    };
    chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, handleMessageRecevied, this);
    return () => {
      chat.off(TencentCloudChat.EVENT.MESSAGE_RECEIVED, handleMessageRecevied, this);
    };
  }, [chat]);
}
