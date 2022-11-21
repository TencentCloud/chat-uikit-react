import React, { PropsWithChildren, useContext } from 'react';
import { ChatSDK, Conversation, Profile } from 'tim-js-sdk';

export interface TUIKitContextValue {
    tim: ChatSDK,
    conversation?: Conversation,
    setActiveConversation: (conversation?: Conversation) => void,
    customClasses?: unknown,
    myProfile?: Profile,
    TUIManageShow?: boolean,
    setTUIManageShow?: React.Dispatch<React.SetStateAction<boolean>>,
    TUIProfileShow?: boolean,
    setTUIProfileShow?: React.Dispatch<React.SetStateAction<boolean>>,
}
export const TUIKitContext = React.createContext<TUIKitContextValue | undefined>(undefined);
export function TUIKitProvider({ children, value }:PropsWithChildren<{
    value: TUIKitContextValue
}>):React.ReactElement {
  return (
    <TUIKitContext.Provider value={(value as unknown) as TUIKitContextValue}>
      {children}
    </TUIKitContext.Provider>
  );
}
export const useTUIKitContext = (componentName?:string):TUIKitContextValue => {
  const contextValue = useContext(TUIKitContext);
  if (!contextValue && componentName) {
    return {} as TUIKitContextValue;
  }
  return (contextValue as unknown) as TUIKitContextValue;
};
