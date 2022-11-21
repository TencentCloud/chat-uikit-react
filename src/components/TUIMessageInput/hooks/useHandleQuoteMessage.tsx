import { useEffect, useState } from 'react';
import TIM, { Message } from 'tim-js-sdk';
import { MESSAGE_OPERATE } from '../../../constants';
import { useTUIChatStateContext } from '../../../context';

const quoteConfigType = {
  [TIM.TYPES.MSG_TEXT]: 1,
  [TIM.TYPES.MSG_CUSTOM]: 2,
  [TIM.TYPES.MSG_IMAGE]: 3,
  [TIM.TYPES.MSG_AUDIO]: 4,
  [TIM.TYPES.MSG_VIDEO]: 5,
  [TIM.TYPES.MSG_FILE]: 6,
  [TIM.TYPES.MSG_FACE]: 8,
};

const quoteConfigForShow = {
  [TIM.TYPES.MSG_CUSTOM]: '[custom]',
  [TIM.TYPES.MSG_IMAGE]: '[image]',
  [TIM.TYPES.MSG_AUDIO]: '[audio]',
  [TIM.TYPES.MSG_VIDEO]: '[video]',
  [TIM.TYPES.MSG_FILE]: '[file]',
  [TIM.TYPES.MSG_FACE]: '[face]',
};

export function useHandleQuoteMessage(msg?:Message) {
  const {
    operateData,
  } = useTUIChatStateContext('TUIMessageInputDefault');

  const [cloudCustomData, setCloudCustomData] = useState({ messageReply: null });

  const handleQuoteMessage = (message: Message) => {
    const messageType = quoteConfigType[message?.type];
    const messageAbstract = message?.type === TIM.TYPES.MSG_TEXT
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
      const message = msg || operateData[MESSAGE_OPERATE.QUOTE];
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
  };
}
