import React, { useState, useCallback, useEffect } from 'react';
import TencentCloudChat, {
  ChatSDK,
  Conversation,
  Group,
  Profile,
} from '@tencentcloud/chat';

export interface UseChatParams{
  chat: ChatSDK,
  activeConversation?: Conversation,
}
export const useTUIKit = ({ chat, activeConversation: paramsActiveConversation }:UseChatParams) => {
  const [conversation, setConversation] = useState<Conversation>(paramsActiveConversation);
  const [myProfile, setMyProfile] = useState<Profile>();
  const [TUIManageShow, setTUIManageShow] = useState<boolean>(false);
  const [TUIProfileShow, setTUIProfileShow] = useState<boolean>(false);
  useEffect(() => {
    const getMyProfile = async () => {
      const res = await chat?.getMyProfile();
      setMyProfile(res?.data);
    };
    getMyProfile();
  }, [chat]);
  const setActiveConversation = useCallback(
    (activeConversation?: Conversation) => {
      if (activeConversation) {
        chat?.setMessageRead({ conversationID: activeConversation.conversationID });
      }
      if (conversation && (activeConversation.conversationID !== conversation.conversationID)) {
        setTUIManageShow(false);
      }
      setConversation(activeConversation);
    },
    [chat],
  );

  useEffect(() => {
    setConversation(paramsActiveConversation);
  }, [paramsActiveConversation]);
  return {
    conversation,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
  };
};
