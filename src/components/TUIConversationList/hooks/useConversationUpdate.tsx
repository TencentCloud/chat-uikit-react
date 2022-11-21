import React, { useEffect } from 'react';
import TIM, { Conversation } from 'tim-js-sdk';
import { useTUIKitContext } from '../../../context';

export const useConversationUpdate = (
  setConversationList?: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
  customHandler?: (
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
    event: any
  ) => void,
  forceUpdate?: () => void,
) => {
  const { tim } = useTUIKitContext('useConversationUpdate');
  useEffect(() => {
    const onConversationListUpdated = (event:any) => {
      if (setConversationList) {
        setConversationList(event.data.filter(
          (item) => item.type !== TIM.TYPES.CONV_SYSTEM,
        ));
      }
      if (forceUpdate) {
        forceUpdate();
      }
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setConversationList, event);
      }
    };
    tim?.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    return () => {
      tim?.off(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    };
  }, [tim, customHandler]);
};
