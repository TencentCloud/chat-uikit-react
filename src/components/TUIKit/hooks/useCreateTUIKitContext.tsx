import React, { useMemo } from 'react';
import { TUIKitContextValue } from '../../../context/TUIKitContext';

export const useCreateTUIKitContext = (value:TUIKitContextValue) => {
  const {
    tim,
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
      tim,
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
      tim,
      TUIManageShow,
      TUIProfileShow,
      setTUIProfileShow,
      myProfile,
    ],
  );
  return TUIKitContext;
};
