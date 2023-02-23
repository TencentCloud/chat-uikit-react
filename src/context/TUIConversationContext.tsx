import React, { useContext } from 'react';
import { Conversation } from 'tim-js-sdk';
import { TUIConversationList } from '../components';

export interface TUIConversationContextValue {
  createConversation?:(conversationID:string) => Promise<any>,
  deleteConversation?:(conversationID:string) => Promise<any>,
  filterConversation?:(conversationList: Array<Conversation>) => Array<Conversation>,
}

export const TUIConversationContext = React.createContext<TUIConversationContextValue>(undefined);
export function TUIConversationProvider({ children, value }:React.PropsWithChildren<{
  value?: TUIConversationContextValue
}>) {
  return (
    <TUIConversationContext.Provider value={value}>
      {children || (
        <TUIConversationList />
      )}
    </TUIConversationContext.Provider>
  );
}
export const useTUIConversationContext = (componentName?:string) => {
  const contextValue = useContext(TUIConversationContext);
  if (!contextValue && componentName) {
    return {};
  }
  return contextValue;
};
