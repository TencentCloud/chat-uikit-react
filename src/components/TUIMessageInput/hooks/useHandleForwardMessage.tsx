import { useEffect, useState } from 'react';
import TIM, { Conversation, Message } from 'tim-js-sdk';
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
  const { tim } = useTUIKitContext('TUIChat');

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
      const res = await tim.getConversationList();
      setConversationList(res?.data?.conversationList.filter(
        (item) => item.type !== TIM.TYPES.CONV_SYSTEM,
      ));
    })();
  }, [tim]);

  return {
    message,
    conversationList,
    sendForwardMessage,
  };
}
