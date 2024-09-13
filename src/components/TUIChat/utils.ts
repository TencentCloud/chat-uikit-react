import TencentCloudChat, { Message, Conversation } from '@tencentcloud/chat';
import TUICore, { TUIConstants } from '@tencentcloud/tui-core';
import TUIChatEngine from '@tencentcloud/chat-uikit-engine';
import { useTUIChatActionContext } from '../../context';
import constant from '../../constants';
import { JSONStringToParse } from '../utils';

export const handleMessage = (messageList: Message[]): Message[] => {
  let customPayloadData: any = null;
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
  messageList: Message[],
  message: Message,
) => {
  const list = [...messageList];
  const index = list.findIndex(item => item?.ID === message?.ID);
  list[index] = message;
  return list;
};

export const handleUploadPendingMessage = (
  messageList: Message[],
  message: Message,
) => {
  const list = [...messageList];
  if (!list.some((item: Message) => item.ID === message?.ID)) {
    list.push(message);
  }
  const index = list.findIndex(item => item?.ID === message?.ID);
  list[index] = message;
  return list;
};

interface IStartCallParams {
  callType: any;
  callMediaType: number;
  userIDList: string[];
  callButtonClicked?: (callMediaType?: number, callType?: any) => void;
}
export const startCall = (params: IStartCallParams) => {
  const { callType, callMediaType, userIDList, callButtonClicked } = params;
  if (callType === TUIChatEngine.TYPES.CONV_C2C) {
    callButtonClicked && callButtonClicked(callMediaType, callType);
    TUICore.callService({
      serviceName: TUIConstants.TUICalling.SERVICE.NAME,
      method: TUIConstants.TUICalling.SERVICE.METHOD.START_CALL,
      params: {
        userIDList,
        type: callMediaType,
        callParams: {
          // doc: https://cloud.tencent.com/document/product/269/105713
          offlinePushInfo: {
            title: 'call',
            description: 'you have a call',
            androidSound: 'private_ring',
            iOSSound: '01.caf',
          },
        },
      },
    });
  }
};
