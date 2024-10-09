import TUICore, { TUIConstants } from '@tencentcloud/tui-core';
import {
  IMessageModel,
  TUIStore,
  StoreName,
  TUIChatService,
} from '@tencentcloud/chat-uikit-engine';

export default class TUIChatServer {
  public currentConversationID = '';
  public currentMessageList: IMessageModel[] = [];

  constructor() {
    // register service
    TUICore.registerService(TUIConstants.TUIChat.SERVICE.NAME, this);
    // watch current conversationID
    TUIStore.watch(StoreName.CONV, {
      currentConversationID: (id: string) => {
        this.currentConversationID = id;
      },
    });
  }

  public onCall(method: string, params: Record<string, any>, callback: void): any {
    let message;
    switch (method) {
      case TUIConstants.TUIChat.SERVICE.METHOD.UPDATE_MESSAGE_LIST:
        message = params.message;
        // Two screen-up situations
        // 1. If the call message conversationID is currentConversation,
        // You need to use UPDATE_MESSAGE_LIST to update the messageList of TUIStore in the engine to display it on the screen
        // (because you cannot get the messages you sent at this time)
        // 2. If the call message conversationID is not currentConversation,
        // The next time you switch to the conversation where the call message is located, getMessageList can get all the call messages you sent
        // No need to process here
        if (message?.conversationID === this.currentConversationID) {
          TUIChatService.updateMessageList([message], 'push');
        }
        break;
      default:
        break;
    }
  }
}
