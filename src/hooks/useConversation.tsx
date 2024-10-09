import TUIChatEngine, { TUIGroupService, TUIConversationService, IConversationModel, CreateGroupParams } from '@tencentcloud/chat-uikit-engine';

async function createC2CConversation(userID: string): Promise<IConversationModel> {
  const response = await TUIConversationService.getConversationProfile(`C2C${userID}`);
  return response.data.conversation;
}

async function createGroupConversation(groupParams: CreateGroupParams): Promise<IConversationModel> {
  if (groupParams.type === TUIChatEngine.TYPES.GRP_COMMUNITY) {
    delete groupParams.groupID;
  }

  const res = await TUIGroupService.createGroup(groupParams);
  const { type } = res.data.group;

  if (type === TUIChatEngine.TYPES.GRP_AVCHATROOM) {
    await TUIGroupService.joinGroup({
      groupID: res.data.group.groupID,
      applyMessage: '',
    });
  }

  const response = await TUIConversationService.getConversationProfile(`GROUP${res.data.group.groupID}`);
  return response.data.conversation;
}

export {
  createC2CConversation,
  createGroupConversation,
};
