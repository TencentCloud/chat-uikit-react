import { useEffect, useState } from 'react';
import TencentCloudChat, { Conversation, Message } from '@tencentcloud/chat';
import { MESSAGE_OPERATE } from '../../../constants';
import {
  useTUIChatActionContext, useTUIChatStateContext, useTUIKitContext,
} from '../../../context';

export function useHandleForwardMessage(msg?:Message) {
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  const [conversationList, setConversationList] = useState([]);
  const { sendMessage, createForwardMessage } = useTUIChatActionContext('useHandleForwardMessage');
  const { chat } = useTUIKitContext('TUIChat');

  const message = msg || operateData[MESSAGE_OPERATE.FORWARD];

  const sendForwardMessage = (list:Array<Conversation>) => {
    list.map((item:Conversation) => {
      const forwardMessage = createForwardMessage({ conversation: item, message });
      sendMessage(forwardMessage);
      return item;
    });
  };

  useEffect(() => {
    (async () => {
      const res = await chat.getConversationList();
      setConversationList(res?.data?.conversationList.filter(
        (item) => item.type !== TencentCloudChat.TYPES.CONV_SYSTEM,
      ));
    })();
  }, [chat]);

  return {
    message,
    conversationList,
    sendForwardMessage,
  };
}
