import React, { PropsWithChildren, useState, useEffect } from 'react';
import { ChatSDK, Conversation } from '@tencentcloud/chat';
import { TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine';
import { useTranslation } from 'react-i18next';
import { isH5, isPC } from '../../utils/env';
import { useTUIKit } from './hooks/useTUIKit';
import { useCreateTUIKitContext } from './hooks/useCreateTUIKitContext';
import { TUIKitProvider } from '../../context/TUIKitContext';
import './styles/index.scss';
import './styles/h5.scss';
import { TUIConversation } from '../TUIConversation';
import { TUIChat } from '../TUIChat';
import { TUIManage } from '../TUIManage';
import { TUIProfile } from '../TUIProfile';
import { TUIContact } from '../TUIContact';
import { TUIContactInfo } from '../TUIContact/TUIContactInfo/TUIContactInfo';
import '../../locales/index';
import chats from '../Icon/images/chats.svg';
import chatsSelected from '../Icon/images/chats-selected.svg';
import contacts from '../Icon/images/contacts.svg';
import contactsSelected from '../Icon/images/contacts-selected.svg';

export interface ChatProps {
  chat?: ChatSDK | null,
  language?: string,
  customClasses?: unknown,
  activeConversation?: Conversation,
}

interface RenderPCProps {
  moduleValue: string,
  tabbarRender: any,
  setModuleValue: (value: string) => void
}
interface RenderH5Props {
  currentConversationID: string
}

const tabbarList = [
  {
    id: 1,
    name: 'chats',
    icon: chats,
    selectedIcon: chatsSelected,
    value: 'chats',
  },
  {
    id: 2,
    name: 'contacts',
    icon: contacts,
    selectedIcon: contactsSelected,
    value: 'contacts',
  },
];
const TUIMessageInputConfig = {
  className: 'sample-h5-input',
  isTransmitter: true,
};

function RenderForPC({ moduleValue, tabbarRender, setModuleValue } : RenderPCProps) {
  return (
    <>
      <div className="sample-chat-left-container">
        <TUIProfile className="sample-chat-profile" />
        {tabbarRender}
        {moduleValue === 'chats' && <TUIConversation />}
        {moduleValue === 'contacts' && <TUIContact />}
      </div>
      {moduleValue === 'chats' && (
      <>
        <TUIChat />
        <TUIManage />
      </>
      )}
      {moduleValue === 'contacts' && (
      <TUIContact>
        <TUIContactInfo
          showChat={() => {
            setModuleValue('chats');
          }}
        />
      </TUIContact>
      )}
    </>
  );
}

function RenderForH5({ currentConversationID }: RenderH5Props) {
  return (
    <>
      {!currentConversationID && (
      <div className="sample-chat-h5-container">
        <TUIProfile className="sample-profile" />
        <TUIConversation />
      </div>
      )}
      {currentConversationID && (
      <>
        <TUIChat TUIMessageInputConfig={TUIMessageInputConfig} />
        <TUIManage />
      </>
      )}
    </>
  );
}
export function TUIKit<
  T extends ChatProps
  >(
  props:PropsWithChildren<T>,
):React.ReactElement {
  const [currentConversationID, setCurrentConversationID] = useState<string>('');
  const [moduleValue, setModuleValue] = useState('chats');
  const { t } = useTranslation();

  const {
    children, chat, customClasses, activeConversation, language = 'en',
  } = props;
  (window as any).tencent_cloud_im_csig_react_uikit_23F_xa = true;
  const {
    conversation,
    contactData,
    setActiveConversation,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
    setActiveContact,
  } = useTUIKit({ chat, activeConversation, language });
  const chatContextValue = useCreateTUIKitContext({
    chat,
    language,
    conversation,
    contactData,
    setActiveConversation,
    customClasses,
    myProfile,
    TUIManageShow,
    setTUIManageShow,
    TUIProfileShow,
    setTUIProfileShow,
    setActiveContact,
  });
  useEffect(() => {
    TUIStore.watch(StoreName.CONV, {
      currentConversationID: onCurrentConversationID,
    });
    return () => {
      TUIStore.unwatch(StoreName.CONV, {
        currentConversationID: onCurrentConversationID,
      });
    };
  }, []);

  const onCurrentConversationID = (id: string) => {
    setCurrentConversationID(id);
  };
  const switchTabbar = (value: string) => {
    setModuleValue(value);
  };

  const tabbarRender = (
    <div className="sample-chat-tab">
      {tabbarList.map((item: any) => (
        <div
          className="sample-chat-tab-container"
          key={item.id}
          role="presentation"
          onClick={() => {
            switchTabbar(item.value);
          }}
        >
          <img src={moduleValue === item.value ? item.selectedIcon : item.icon} alt="" />
          <p className={`sample-chat-tab-text ${moduleValue === item.value ? 'sample-chat-tab-active' : ''}`}>
            {t(item.name)}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <TUIKitProvider value={chatContextValue}>
      <div className="tui-kit">
        {children || (isPC && <RenderForPC moduleValue={moduleValue} tabbarRender={tabbarRender} setModuleValue={setModuleValue} />)
        || (isH5 && <RenderForH5 currentConversationID={currentConversationID} />)}
      </div>
    </TUIKitProvider>
  );
}
