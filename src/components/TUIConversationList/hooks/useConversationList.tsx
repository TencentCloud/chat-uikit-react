import React, { useEffect, useState } from 'react';
import TencentCloudChat, { ChatSDK, Conversation } from '@tencentcloud/chat';
import {
  TUIStore,
  StoreName,
} from '@tencentcloud/chat-uikit-engine';
function useConversationList(
  chat: ChatSDK,
  activeConversationHandler?:(
    conversationList: Array<Conversation>,
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
  ) => void,
  filterConversation?:(conversationList: Array<Conversation>) => Array<Conversation>,
) {
  const [conversationList, setConversationList] = useState<Array<Conversation>>([]);
  const onConversationListUpdated = (list: any) => {
    let resConversationList = [];
    if (filterConversation) {
      resConversationList = filterConversation(list);
    } else {
      resConversationList = list.filter(
        (item: any) => item.type !== TencentCloudChat.TYPES.CONV_SYSTEM,
      );
    }
    setConversationList(resConversationList);
    if (activeConversationHandler) {
      activeConversationHandler(resConversationList, setConversationList);
    }
  };

  useEffect(() => {
    TUIStore.watch(StoreName.CONV, {
      conversationList: onConversationListUpdated,
    }); 
  }, [chat]);
  return {
    conversationList,
    setConversationList,
  };
}

export default useConversationList;
