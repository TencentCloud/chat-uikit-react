import { useEffect, useState } from 'react';
import TencentCloudChat, { Conversation, Message } from '@tencentcloud/chat';
import {
  TUIChatService,
} from '@tencentcloud/chat-uikit-engine';
import { MESSAGE_OPERATE } from '../../../constants';
import { useTUIChatStateContext } from '../../../context';
import { useUIManagerStore } from '../../../store';

export function useHandleForwardMessage(msg?: Message) {
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  const [conversationList, setConversationList] = useState([]);
  const { chat } = useUIManagerStore();

  const message = msg || (operateData && operateData[MESSAGE_OPERATE.FORWARD]);

  const sendForwardMessage = (list: Conversation[]) => {
    list.map((item: Conversation) => {
      message && TUIChatService.sendForwardMessage([item], [message]);
      return item;
    });
  };

  useEffect(() => {
    if (!chat) return;
    (async () => {
      const res = await chat.getConversationList();
      setConversationList(res?.data?.conversationList.filter(
        (item: any) => item.type !== TencentCloudChat.TYPES.CONV_SYSTEM,
      ));
    })();
  }, [chat]);

  return {
    message,
    conversationList,
    sendForwardMessage,
  };
}
