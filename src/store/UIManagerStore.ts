import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { TUILogin } from '@tencentcloud/tui-core';
import { TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine';
import type { IConversationModel, IGroupModel } from '@tencentcloud/chat-uikit-engine';
import type { Profile, Friend, FriendApplication } from '@tencentcloud/chat';

type BlockData = {
  type: 'block';
  data: Profile;
};

type FriendData = {
  type: 'friend';
  data: Friend;
};

type FriendApplicationData = {
  type: 'friendApplication';
  data: FriendApplication;
};

type AddFriendData = {
  type: 'addFriend';
  data: Profile;
};

type GroupData = {
  type: 'group';
  data: IGroupModel;
};

type ContactParams =
  | BlockData
  | FriendData
  | FriendApplicationData
  | AddFriendData
  | GroupData;

interface IUIManagerState {
  chat: any;
  myProfile: Profile | undefined;
  contactData: ContactParams | undefined;
  conversation: IConversationModel | undefined;
  TUIProfileShow: boolean;
  TUIManageShow: boolean;
}

interface IUIManagerAction {
  setMyProfile: (profile?: Profile | undefined) => void;
  setActiveContact: (contact?: ContactParams) => void;
  setActiveConversation: (conversation?: IConversationModel) => void;
  setTUIProfileShow: (show: boolean) => void;
  setTUIManageShow: (show: boolean) => void;
}

const uiManagerStore = createStore<IUIManagerState & IUIManagerAction>()(set => ({
  chat: null,
  myProfile: undefined,
  contactData: undefined,
  conversation: undefined,
  TUIProfileShow: false,
  TUIManageShow: false,
  setMyProfile: myProfile => set(() => ({ myProfile: myProfile })),
  setActiveContact: contact => set(() => ({ contactData: contact })),
  setActiveConversation: conversation => set(() => ({ conversation: conversation })),
  setTUIProfileShow: value => set(() => ({ TUIProfileShow: value })),
  setTUIManageShow: value => set(() => ({ TUIManageShow: value })),
}));

TUIStore.watch(StoreName.USER, {
  userProfile: onMyProfileUpdated,
});

TUIStore.watch(StoreName.CONV, {
  currentConversation: onCurrentConversationUpdated,
});

function onMyProfileUpdated(userProfileData: Profile) {
  uiManagerStore.getState().setMyProfile(userProfileData);
}

function onCurrentConversationUpdated(conversationModel: IConversationModel) {
  if (conversationModel?.conversationID !== uiManagerStore.getState().conversation?.conversationID) {
    uiManagerStore.getState().setTUIManageShow(false);
  }
  uiManagerStore.getState().setActiveConversation(conversationModel);
}

function useUIManagerStore(..._args: any[]) {
  return {
    chat: TUILogin.getContext().chat,
    myProfile: useStore(uiManagerStore, state => state.myProfile),
    contactData: useStore(uiManagerStore, state => state.contactData),
    conversation: useStore(uiManagerStore, state => state.conversation),
    TUIProfileShow: useStore(uiManagerStore, state => state.TUIProfileShow),
    TUIManageShow: useStore(uiManagerStore, state => state.TUIManageShow),
    // do not need setMyProfile, because myProfile is read-only and cannot be written
    setActiveContact: useStore(uiManagerStore, state => state.setActiveContact),
    setActiveConversation: useStore(uiManagerStore, state => state.setActiveConversation),
    setTUIProfileShow: useStore(uiManagerStore, state => state.setTUIProfileShow),
    setTUIManageShow: useStore(uiManagerStore, state => state.setTUIManageShow),
  };
}
export {
  useUIManagerStore,
};
export default uiManagerStore;
