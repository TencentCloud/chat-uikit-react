import React from 'react';
import { Message } from '@tencentcloud/chat';

interface EnrichedMessageListProps {
  messageList: Array<Message>;
}

function useEnrichedMessageList(props:EnrichedMessageListProps) {
  const { messageList } = props;

  return {
    messageList,
  };
}

export default useEnrichedMessageList;
