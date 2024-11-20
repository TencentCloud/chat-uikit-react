import { useLayoutEffect, useState } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
import { useTUIChatStateContext } from '../../../context';
import { useUIManagerStore } from '../../../store';
import { JSONStringToParse } from '../../utils';

interface messageContextParams {
  message?: Message;
}

const replyType: any = {
  [TencentCloudChat.TYPES.MSG_TEXT]: 1,
  [TencentCloudChat.TYPES.MSG_FACE]: 8,
  [TencentCloudChat.TYPES.MSG_IMAGE]: 3,
  [TencentCloudChat.TYPES.MSG_AUDIO]: 4,
  [TencentCloudChat.TYPES.MSG_VIDEO]: 5,
  [TencentCloudChat.TYPES.MSG_FILE]: 6,
  [TencentCloudChat.TYPES.MSG_CUSTOM]: 2,
};

export const useMessageReply = <T extends messageContextParams>(params: T) => {
  const {
    message,
  } = params;
  const [messageReply, setMessageReply] = useState(null);
  const [sender, setSender] = useState('');
  const [replyMessage, setReplyMessage] = useState(null);
  const [messageID, setMessageID] = useState('');

  const { chat } = useUIManagerStore();
  const { messageList } = useTUIChatStateContext('useMessageReply');

  useLayoutEffect(() => {
    message && handleMessageReply(message);
  }, [message]);

  const handleMessageReply = (data: Message) => {
    if (!data?.cloudCustomData) {
      return;
    }
    const cloudCustomData = JSONStringToParse(data?.cloudCustomData);
    const reply = cloudCustomData?.messageReply || '';
    if (!reply) {
      return;
    }
    setMessageReply(reply);
    setSender(reply?.messageSender);
    setMessageID(reply?.messageID);
    const replyData = messageList?.filter((item) => {
      const isSomeID = item.ID === reply?.messageID;
      const isSomeType = isSomeID && replyType[item.type] === reply.messageType;
      const isSomeContent = item.type === TencentCloudChat.TYPES.MSG_TEXT
        ? item.payload.text === reply.messageAbstract
        : true;
      return isSomeID && isSomeType && isSomeContent;
    });
    // eslint-disable-next-line
    // @ts-ignore
    setReplyMessage(replyData[0] || chat.findMessage(reply?.messageID));
  };

  return {
    messageReply,
    sender,
    replyMessage,
    messageID,
    message,
  };
};
