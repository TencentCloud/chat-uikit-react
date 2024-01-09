import React, { PropsWithChildren, useContext } from 'react';
import {
  ChatSDK,
  Conversation,
  Profile,
} from '@tencentcloud/chat';
import { UseContactParams } from '../components/TUIKit/hooks/useTUIKit';

export interface TUIKitContextValue {
    chat: ChatSDK,
    language: string,
    conversation?: Conversation,
    contactData?: UseContactParams,
    setActiveConversation: (conversation?: Conversation) => void,
    customClasses?: unknown,
    myProfile?: Profile,
    TUIManageShow?: boolean,
    setTUIManageShow?: React.Dispatch<React.SetStateAction<boolean>>,
    TUIProfileShow?: boolean,
    // 激活 contact 列表数据，右侧显示数据，无参数时，右侧数据默认为空
    setActiveContact: (UseContactParams?: UseContactParams) => void,
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
