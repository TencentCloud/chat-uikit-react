import { useLayoutEffect } from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { useTUIKitContext } from '../../../context';

export function useMessageReceviedListener(
  setMessageList:(event?: Array<Message>) => void,
  customHandler?: (
    updateMessage: (event?: Array<Message>) => void,
    event: any,
  ) => void,
) {
  const { tim } = useTUIKitContext('useMessageReceviedListener');
  useLayoutEffect(() => {
    const handleMessageRecevied = (event: any) => {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setMessageList, event);
      } else {
        setMessageList(event.data);
      }
    };
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, handleMessageRecevied, this);
    return () => {
      tim.off(TIM.EVENT.MESSAGE_RECEIVED, handleMessageRecevied, this);
    };
  }, [tim]);
}
