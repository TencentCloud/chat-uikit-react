import React, { useMemo } from 'react';
import { TUIKitContextValue } from '../../../context/TUIKitContext';

export const useCreateTUIKitContext = (value:TUIKitContextValue) => {
  const {
    chat,
    language,
    conversation,
    contactData,
    customClasses,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
    setActiveContact,
  } = value;

  const TUIKitContext = useMemo(
    () => ({
      chat,
      language,
      conversation,
      contactData,
      customClasses,
      setActiveConversation,
      myProfile,
      TUIManageShow,
      setTUIManageShow,
      TUIProfileShow,
      setTUIProfileShow,
      setActiveContact,
    }),
    [
      language,
      conversation,
      contactData,
      customClasses,
      chat,
      TUIManageShow,
      TUIProfileShow,
      setTUIProfileShow,
      myProfile,
    ],
  );
  return TUIKitContext;
};
