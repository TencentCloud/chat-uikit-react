import React from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { useTUIConversationContext } from '../context/TUIConversationContext';

export interface CreateGroupConversationParams {
  name: string;
  type?: TencentCloudChat.TYPES;
  groupID?: string;
  introduction?: string;
  notification?: string;
  avatar?: string;
  maxMemberNum?: number;
  joinOption?: string;
  memberList?: Array<object>;
  groupCustomField?: Array<object>;
  isSupportTopic?: boolean;
}
export const useConversation = (chat) => {
  const {
    createConversation: contextCreateConversation,
    deleteConversation: contextDeleteConversation,
  } = useTUIConversationContext('useConversation');
  const createConversation = async (
    params: string | CreateGroupConversationParams,
  ) => {
    // create c2c conversation
    if (typeof params === 'string') {
      const { data } = await chat.getConversationProfile(params);
      return data.conversation;
    }
    // create group conversation
    const {
      name,
      type,
      groupID,
      introduction,
      notification,
      avatar,
      maxMemberNum,
      joinOption,
      memberList = [],
      groupCustomField = [],
      isSupportTopic,
    } = params;
    const res = await chat.createGroup({
      name,
      type,
      groupID,
      introduction,
      notification,
      avatar,
      maxMemberNum,
      joinOption,
      memberList,
      groupCustomField,
      isSupportTopic,
    });
    const { groupID: createdGroupID } = res.data.group;
    if (type === TencentCloudChat.TYPES.GRP_AVCHATROOM) {
      await chat.joinGroup({
        groupID: createdGroupID,
        type: TencentCloudChat.TYPES.GRP_AVCHATROOM,
      });
    }
    const { data } = await chat.getConversationProfile(`GROUP${createdGroupID}`);
    return data.conversation;
  };
  const pinConversation = (options: {
    conversationID: string;
    isPinned: boolean;
  }) => chat.pinConversation(options);
  const deleteConversation = (conversationID: string) => chat.deleteConversation(conversationID);
  return {
    createConversation: contextCreateConversation || createConversation,
    pinConversation,
    deleteConversation: contextDeleteConversation || deleteConversation,
  };
};
