import React from 'react';
import { Message } from 'tim-js-sdk';

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
