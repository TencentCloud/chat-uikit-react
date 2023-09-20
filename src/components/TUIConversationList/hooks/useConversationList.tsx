import React, { useEffect, useState } from 'react';
import TencentCloudChat, { ChatSDK, Conversation } from '@tencentcloud/chat';

function useConversationList(
  chat: ChatSDK,
  activeConversationHandler?:(
    conversationList: Array<Conversation>,
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
  ) => void,
  filterConversation?:(conversationList: Array<Conversation>) => Array<Conversation>,
) {
  const [conversationList, setConversationList] = useState<Array<Conversation>>([]);
  const queryConversation = async (queryType?: string) => {
    if (queryType === 'reload') {
      setConversationList([]);
    }
    const offset = queryType === 'reload' ? 0 : conversationList.length;

    const res = await chat?.getConversationList();
    if (res?.code === 0) {
      let resConversationList = [];
      if (filterConversation) {
        resConversationList = filterConversation(res.data.conversationList);
      } else {
        resConversationList = res.data.conversationList.filter(
          (item) => item.type !== TencentCloudChat.TYPES.CONV_SYSTEM,
        );
      }
      const newConversationList = queryType === 'reload'
        ? resConversationList
        : [...conversationList, resConversationList];
      setConversationList(newConversationList);
      if (!offset && activeConversationHandler) {
        activeConversationHandler(newConversationList, setConversationList);
      }
    }
  };
  useEffect(() => {
    queryConversation('reload');
  }, [chat]);
  return {
    conversationList,
    setConversationList,
  };
}

export default useConversationList;
