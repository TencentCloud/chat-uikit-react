import React, { useMemo } from 'react';
import { TUIKitContextValue } from '../../../context/TUIKitContext';

export const useCreateTUIKitContext = (value:TUIKitContextValue) => {
  const {
    chat,
    conversation,
    customClasses,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
  } = value;

  const TUIKitContext = useMemo(
    () => ({
      chat,
      conversation,
      customClasses,
      setActiveConversation,
      myProfile,
      TUIManageShow,
      setTUIManageShow,
      TUIProfileShow,
      setTUIProfileShow,
    }),
    [
      conversation,
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
