const constant = {
  typeC2C: 'isC2C',
  typeGroup: 'isGroup',
  cancel: 'cancel',
  group: 'GROUP',
  handleMessage: {
    revoke: 'revoke',
    copy: 'copy',
    delete: 'delete',
    forward: 'forward',
    reply: 'reply',
  },
  at: '@',
  all: '所有人',
  typeForward: 'forward',
  typeMute: 'mute',
  typeOrder: 'order',
  typeService: 'consultion',
  typeReply: 'quick_reply',
  typeEvaluate: 'evaluation',
  typeTextLink: 'text_link',
  typeAndroid: 'android',
  typeIphone: 'iphone',
  typeMini: 'miniprogram',
  TYPE_TYPING: 'user_typing_status',
  typeInputStatusIng: 'EIMAMSG_InputStatus_Ing',
  typeInputStatusEnd: 'EIMAMSG_InputStatus_End',
};

export enum CONSTANT_DISPATCH_TYPE {
  RESET = 'reset',
  SET_CONVERSATION_PRPFILE = 'setConversationProfile',
  SET_MESSAGELIST = 'setMessageList',
  SET_UPDATE_MESSAGE = 'setUpdateMessage',
  SET_EDIT_MESSAGE = 'setEditMessage',
  SET_REMOVE_MESSAGE = 'setRemoveMessage',
  SET_HISTORY_MESSAGELIST = 'setHistoryMessageList',
  SET_NEXT_REQ_MESSAGE_ID = 'setNextReqMessageID',
  SET_IS_COMPLETE = 'setIsComplete',
  SET_TEXT = 'setText',
  SET_HIGH_LIGHTED_MESSAGE_ID ='setHightLightedMessageID',
  OPERATE_MESSAGE = 'operateMessage',
  SET_NO_MORE = 'setNoMore',
  SET_CURSOR_POS = 'setCursorPos',
}

export enum MESSAGE_TYPE {
  TEXT = 1,
  CUSTOM = 2,
  IMAGE = 3,
  AUDIO = 4,
  VIDEO = 5,
  FILE = 6,
  FACE = 8,
}

export enum MESSAGE_STATUS {
  UNSEND = 'unSend',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export enum MESSAGE_FLOW {
  IN = 'in',
  OUT = 'out',
}

export enum MESSAGE_TYPE_NAME {
  TEXT = 'text',
  CUSTOM = 'custom',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  FILE = 'file',
  FACE = 'face',
}

export enum MESSAGE_OPERATE {
  REVOKE = 'revoke',
  QUOTE = 'quote',
  FORWARD = 'forward',
}

export default constant;
