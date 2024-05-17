import { useEffect, useState } from 'react';
import TencentCloudChat, { Message } from '@tencentcloud/chat';
import { MESSAGE_OPERATE } from '../../../constants';
import { useTUIChatStateContext } from '../../../context';

const quoteConfigType: any = {
  [TencentCloudChat.TYPES.MSG_TEXT]: 1,
  [TencentCloudChat.TYPES.MSG_CUSTOM]: 2,
  [TencentCloudChat.TYPES.MSG_IMAGE]: 3,
  [TencentCloudChat.TYPES.MSG_AUDIO]: 4,
  [TencentCloudChat.TYPES.MSG_VIDEO]: 5,
  [TencentCloudChat.TYPES.MSG_FILE]: 6,
  [TencentCloudChat.TYPES.MSG_FACE]: 8,
};

const quoteConfigForShow: any = {
  [TencentCloudChat.TYPES.MSG_CUSTOM]: '[custom]',
  [TencentCloudChat.TYPES.MSG_IMAGE]: '[image]',
  [TencentCloudChat.TYPES.MSG_AUDIO]: '[audio]',
  [TencentCloudChat.TYPES.MSG_VIDEO]: '[video]',
  [TencentCloudChat.TYPES.MSG_FILE]: '[file]',
  [TencentCloudChat.TYPES.MSG_FACE]: '[face]',
};

export function useHandleQuoteMessage(msg?:Message) {
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  const [cloudCustomData, setCloudCustomData] = useState<any>({ messageReply: null });

  const handleQuoteMessage = (message: Message) => {
    const messageType = quoteConfigType[message?.type];
    const messageAbstract = message?.type === TencentCloudChat.TYPES.MSG_TEXT
      ? message?.payload?.text
      : quoteConfigForShow[message?.type];

    return {
      messageAbstract,
      messageSender: message?.nick || message?.from,
      messageID: message?.ID,
      messageType,
      version: 1,
    };
  };

  useEffect(
    () => {
      const message = msg || (operateData &&operateData[MESSAGE_OPERATE.QUOTE]);
      setCloudCustomData(
        {
          messageReply: message ? handleQuoteMessage(message) : null,
        },
      );
    },
    [operateData, msg],
  );

  return {
    cloudCustomData,
    handleQuoteMessage,
    message: msg || (operateData &&operateData[MESSAGE_OPERATE.QUOTE]),
  };
}
