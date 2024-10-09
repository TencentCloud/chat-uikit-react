import React, {
  PropsWithChildren, useContext,
} from 'react';
import { Friend, Profile, FriendApplication } from '@tencentcloud/chat';

export interface TUIContactContextValue {
  friendList?: Friend[];
  blocklistProfile?: Profile[];
  friendApplicationList?: FriendApplication[];
  blockList?: string[];
  isShowContactList?: boolean;
  setShowContactList?: React.Dispatch<React.SetStateAction<boolean>>;
}
export const TUIContactContext = React.createContext<TUIContactContextValue>({});
export function TUIContactContextProvider({ children, value }: PropsWithChildren<{
  value: TUIContactContextValue;
}>): React.ReactElement {
  return (
    <TUIContactContext.Provider value={value}>
      {children}
    </TUIContactContext.Provider>
  );
}

export function useTUIContactContext(componentName?: string): TUIContactContextValue {
  const contextValue = useContext(TUIContactContext);
  if (!contextValue && componentName) {
    return {} as TUIContactContextValue;
  }
  return (contextValue as unknown) as TUIContactContextValue;
}
