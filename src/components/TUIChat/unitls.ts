import TIM, { Message } from 'tim-js-sdk';
import constant from '../../constants';
import type { TUIChatStateContextValue } from '../../context';
import { JSONStringToParse } from '../untils';

export const handleMessage = (messageList:Array<Message>):Array<Message> => {
  let customPayloadData = null;
  return messageList.filter((item) => {
    if (item.type === TIM.TYPES.MSG_CUSTOM) {
      customPayloadData = JSONStringToParse(item?.payload?.data);
    }
    if (customPayloadData && customPayloadData?.businessID === constant.TYPE_TYPING) {
      return false;
    }
    return true;
  });
};

export const handleMessageList = (
  list:Array<Message>,
  state:TUIChatStateContextValue,
) => {
  const data = {
    messageList: [],
    lastMessageID: '',
    isSameLastMessageID: false,
  };
  data.messageList = list;
  if (data.messageList.length >= 1) {
    data.lastMessageID = data?.messageList[data.messageList.length - 1]?.ID;
  }
  data.messageList = data.messageList.filter((item) => !item?.isDeleted);
  data.isSameLastMessageID = data?.lastMessageID === state?.lastMessageID;
  return data;
};

export const handleEditMessage = (
  messageList: Array<Message>,
  message: Message,
) => {
  const list = [...messageList];
  const index = list.findIndex((item) => item?.ID === message?.ID);
  list[index] = message;
  return list;
};

export const handleRemoveMessage = (
  messageList: Array<Message>,
  message: Message,
) => {
  const list = [...messageList];
  const index = list.findIndex((item) => item?.ID === message?.ID);
  list.splice(index, 1);
  return list;
};
