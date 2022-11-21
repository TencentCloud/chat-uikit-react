import { useLayoutEffect, useState } from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { useTUIChatStateContext, useTUIKitContext } from '../../../context';
import { JSONStringToParse } from '../../untils';

interface messageContextParams {
  message?: Message,
}

const replyType = {
  [TIM.TYPES.MSG_TEXT]: 1,
  [TIM.TYPES.MSG_FACE]: 8,
  [TIM.TYPES.MSG_IMAGE]: 3,
  [TIM.TYPES.MSG_AUDIO]: 4,
  [TIM.TYPES.MSG_VIDEO]: 5,
  [TIM.TYPES.MSG_FILE]: 6,
  [TIM.TYPES.MSG_CUSTOM]: 2,
};

export const useMessageReply = <T extends messageContextParams>(params:T) => {
  const {
    message,
  } = params;
  const [messageReply, setMessageReply] = useState(null);
  const [sender, setSender] = useState('');
  const [replyMessage, setReplyMessage] = useState(null);
  const [messageID, setMessageID] = useState('');

  const { tim } = useTUIKitContext('TUIChat');
  const { messageList } = useTUIChatStateContext('useMessageReply');

  useLayoutEffect(() => {
    handleMessageReply(message);
  }, [message]);

  const handleMessageReply = (data:Message) => {
    if (!data?.cloudCustomData) {
      return;
    }
    const cloudCustomData = JSONStringToParse(message?.cloudCustomData);
    const reply = cloudCustomData?.messageReply || '';
    if (!reply) {
      return;
    }
    setMessageReply(reply);
    setSender(reply?.messageSender);
    setMessageID(reply?.messageID);
    const replyData = messageList.filter((item) => {
      const isSomeID = item.ID === reply?.messageID;
      const isSomeType = isSomeID && replyType[item.type] === reply.messageType;
      const isSomeContent = item.type === TIM.TYPES.MSG_TEXT
        ? item.payload.text === reply.messageAbstract : true;
      return isSomeID && isSomeType && isSomeContent;
    });
    setReplyMessage(replyData[0] || tim.findMessage(reply?.messageID));
  };

  return {
    messageReply,
    sender,
    replyMessage,
    messageID,
    message,
  };
};
