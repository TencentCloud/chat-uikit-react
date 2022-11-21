import React, { useEffect, useState } from 'react';
import TIM, { ChatSDK, Conversation } from 'tim-js-sdk';

function useConversationList(
  tim: ChatSDK,
  activeConversationHandler?:(
    conversationList: Array<Conversation>,
    setConversationList: React.Dispatch<React.SetStateAction<Array<Conversation>>>,
  ) => void,
) {
  const [conversationList, setConversationList] = useState<Array<Conversation>>([]);
  const queryConversation = async (queryType?: string) => {
    if (queryType === 'reload') {
      setConversationList([]);
    }
    const offset = queryType === 'reload' ? 0 : conversationList.length;

    const res = await tim?.getConversationList();
    if (res?.code === 0) {
      const resConversationList = res.data.conversationList.filter(
        (item) => item.type !== TIM.TYPES.CONV_SYSTEM,
      );
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
  }, [tim]);
  return {
    conversationList,
    setConversationList,
  };
}

export default useConversationList;
