import React, { useState, useCallback, useEffect } from 'react';
import { ChatSDK, Conversation, Profile } from 'tim-js-sdk';

export interface UseChatParams{
  tim: ChatSDK
}
export const useTUIKit = ({ tim }:UseChatParams) => {
  const [conversation, setConversation] = useState<Conversation>();
  const [myProfile, setMyProfile] = useState<Profile>();
  const [TUIManageShow, setTUIManageShow] = useState<boolean>(false);
  const [TUIProfileShow, setTUIProfileShow] = useState<boolean>(false);
  useEffect(() => {
    const getMyProfile = async () => {
      const res = await tim?.getMyProfile();
      setMyProfile(res?.data);
    };
    getMyProfile();
  }, [tim]);
  const setActiveConversation = useCallback(
    (activeConversation?: Conversation) => {
      if (activeConversation) {
        tim?.setMessageRead({ conversationID: activeConversation.conversationID });
      }
      if (conversation && (activeConversation.conversationID !== conversation.conversationID)) {
        setTUIManageShow(false);
      }
      setConversation(activeConversation);
    },
    [tim],
  );
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
