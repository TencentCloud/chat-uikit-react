import TencentCloudChat, { Message } from '@tencentcloud/chat';
import constant from '../../constants';
import { JSONStringToParse } from '../untils';

export const handleMessage = (messageList:Array<Message>):Array<Message> => {
  let customPayloadData = null;
  return messageList.filter((item) => {
    if (item.type === TencentCloudChat.TYPES.MSG_CUSTOM) {
      customPayloadData = JSONStringToParse(item?.payload?.data);
    }
    if (customPayloadData && customPayloadData?.businessID === constant.TYPE_TYPING) {
      return false;
    }
    return true;
  });
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

export const handleUploadPendingMessage = (
  messageList: Array<Message>,
  message: Message,
) => {
  const list = [...messageList];
  if (!list.some((item:Message) => item.ID === message.ID)) {
    list.push(message);
  }
  const index = list.findIndex((item) => item?.ID === message?.ID);
  list[index] = message;
  return list;
};
