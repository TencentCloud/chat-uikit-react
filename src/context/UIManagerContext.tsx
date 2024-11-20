import React, {
  useState,
  useContext,
  useCallback,
  PropsWithChildren,
  useEffect,
} from 'react';
import type {
  Conversation,
  Profile,
  Friend,
  FriendApplication,
} from '@tencentcloud/chat';
import {
  TUIStore,
  StoreName,
  type IConversationModel,
} from '@tencentcloud/chat-uikit-engine';
import type { IGroupModel } from '@tencentcloud/chat-uikit-engine';
import { useUIManagerStore } from '../store';

type blockData = {
  type: 'block';
  data: Profile;
};

type friendData = {
  type: 'friend';
  data: Friend;
};

type friendApplicationData = {
  type: 'friendApplication';
  data: FriendApplication;
};

type addFriendData = {
  type: 'addFriend';
  data: Profile;
};

type GroupData = {
  type: 'group';
  data: IGroupModel;
};

type UseContactParams =
  | blockData
  | friendData
  | friendApplicationData
  | addFriendData
  | GroupData
  | undefined;

type UIManagerContextType = {
  conversation?: Conversation;
  contactData?: UseContactParams;
  customClasses?: unknown;
  myProfile?: Profile;
  TUIManageShow?: boolean;
  TUIProfileShow?: boolean;
  setTUIManageShow: React.Dispatch<React.SetStateAction<boolean>>;
  setTUIProfileShow: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveConversation: (conversation?: Conversation) => void;
  setActiveContact: (useContactParams?: UseContactParams) => void;
};

type UIManagerProviderProps = {
  activeConversation: Conversation;
};

console.warn('UIManagerContext has been deprecated.');

const UIManagerContext = React.createContext<UIManagerContextType | null>(null);

function UIManagerProvider(props: PropsWithChildren<Partial<UIManagerProviderProps>>) {
  const {
    activeConversation,
    children,
  } = props;

  const { chat } = useUIManagerStore();

  const [conversation, setConversation] = useState<Conversation | undefined>(activeConversation);
  const [contactData, setContactData] = useState<UseContactParams>();
  const [myProfile, setMyProfile] = useState<Profile>();
  const [TUIManageShow, setTUIManageShow] = useState<boolean>(false);
  const [TUIProfileShow, setTUIProfileShow] = useState<boolean>(false);

  useEffect(() => {
    TUIStore.watch(StoreName.USER, {
      userProfile: onMyProfileUpdated,
    });
    TUIStore.watch(StoreName.CONV, {
      currentConversation: onCurrentConversationUpdated,
    });

    return () => {
      TUIStore.unwatch(StoreName.USER, {
        userProfile: onMyProfileUpdated,
      });
      TUIStore.unwatch(StoreName.CONV, {
        currentConversation: onCurrentConversationUpdated,
      });
    };
  }, []);

  const setActiveConversation = useCallback((_activeConversation?: Conversation) => {
    if (_activeConversation) {
      chat?.setMessageRead({ conversationID: _activeConversation.conversationID });
    }

    if (_activeConversation?.conversationID !== conversation?.conversationID) {
      setTUIManageShow(false);
    }

    setConversation(_activeConversation);
  }, []);

  function onMyProfileUpdated(userProfileData: unknown) {
    setMyProfile(userProfileData as Profile);
  }

  function onCurrentConversationUpdated(conversationModel: IConversationModel) {
    setActiveConversation(conversationModel?.getConversation());
  }

  function setActiveContact(actionContactData?: UseContactParams) {
    setContactData(actionContactData);
  }

  const value = {
    conversation,
    contactData,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
    setActiveContact,
  };

  return (
    <UIManagerContext.Provider value={value}>
      {children}
    </UIManagerContext.Provider>
  );
}

const useUIManager = (_componentName?: string) => {
  const context = useContext(UIManagerContext);
  if (!context) {
    throw new Error('useUIManager must be used within a UIManagerProvider');
  }
  return context;
};

export {
  UIManagerProvider,
  useUIManager,
  UIManagerContextType,
};
