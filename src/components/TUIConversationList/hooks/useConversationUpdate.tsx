import React, { useEffect } from 'react';
import TencentCloudChat, { Conversation } from '@tencentcloud/chat';
import { useUIKit } from '../../../context';

export const useConversationUpdate = (
  setConversationList?: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
  customHandler?: (
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
    event: any
  ) => void,
  forceUpdate?: () => void,
  filterConversation?:(conversationList: Array<Conversation>) => Array<Conversation>,
) => {
  const { chat } = useUIKit('useConversationUpdate');
  useEffect(() => {
    const onConversationListUpdated = (event:any) => {
      if (setConversationList) {
        if (filterConversation) {
          setConversationList(filterConversation(event.data));
        } else {
          setConversationList(event.data.filter(
            (item: any) => item.type !== TencentCloudChat.TYPES.CONV_SYSTEM,
          ));
        }
      }
      if (forceUpdate) {
        forceUpdate();
      }
      if (customHandler && typeof customHandler === 'function') {
        setConversationList && customHandler(setConversationList, event);
      }
    };
    chat?.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    return () => {
      chat?.off(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
    };
  }, [chat, customHandler]);
};
