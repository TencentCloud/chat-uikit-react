import { useEffect, useState } from 'react';
import { IconMessage, IconUser, useUIKit } from '@tencentcloud/uikit-base-component-react';
import {
  Chat,
  ChatHeader,
  MessageList,
  MessageInput,
  ConversationList,
  useLoginState,
  LoginStatus,
  ContactList,
  ContactInfo,
} from '@tencentcloud/chat-uikit-react';
import { TUIConversationService, TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import { TUICallKit, TUICallKitServer } from '@tencentcloud/call-uikit-react';
import { ChatDefaultContent, Tab, TabList } from '../../components';
import { reportEvent, REPORT_KEY } from '../../utils/aegis';
import '../../locales';

import './index.scss';

export const loginInfo = {
  // Your Application SDKAppID, number type
  SDKAppID: 0,
  // Your UserID, string type
  userID: '',
  // Your UserSig, string type
  userSig: '',
}

export default function SampleChat() {

  const { language, setLanguage } = useUIKit();
  const { status } = useLoginState(loginInfo);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    TUIStore.watch(StoreName.APP, {
      tasks: onTasksUpdated,
    });
    return () => {
      TUIStore.unwatch(StoreName.APP, {
        tasks: onTasksUpdated,
      });
    };
  }, [])

  function onTasksUpdated(tasks: Record<string, boolean>) {
    if (tasks.sendMessage) {
      reportEvent({ actionKey: REPORT_KEY.SEND_FIRST_MESSAGE });
    }
  }

  useEffect(() => {
    if (status === LoginStatus.SUCCESS) {
      createChat();
      TUICallKitServer.setLanguage('en');
    }
  }, [status])

  async function createChat() {
    // 1v1 chat: conversationID = `C2C${userID}`
    // group chat: conversationID = `GROUP${groupID}`
    const userID = 'administrator'; // userID: Recipient of the Message userID, Get it from Step 5
    const conversationID = `C2C${userID}`;
    const conversationProfile = await TUIConversationService.getConversationProfile(conversationID)
  }

  const enterChat = () => {
    setActiveTab('chats');
  }

  const callStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: '999',
    transform: 'translate(-50%, -50%)',
  };

  const Application =  (
    <div className="sample-chat">
        <TUICallKit style={callStyle} />
        <div className="sample-chat-left-container">
          <TabList activeTab={activeTab} onChange={setActiveTab}>
            <Tab tabId="chats" label="Chats" Icon={<IconMessage size='24px' />} />
            <Tab tabId="contacts" label="Contacts"  Icon={<IconUser size='24px' />} />
          </TabList>
          {activeTab === 'chats' ? (
            <ConversationList />
          ) : (
            <ContactList />
          )}
        </div>
        {activeTab === 'chats' &&
        <>
          <Chat PlaceholderEmpty={<ChatDefaultContent />}>
            <ChatHeader />
            <MessageList />
            <MessageInput />
          </Chat>
        </>}
        {activeTab === 'contacts' &&
         <ContactInfo
          PlaceholderEmpty={<ChatDefaultContent />}
          onSendMessage={enterChat}
          onEnterGroup={enterChat}
        />}

    </div>
  );

  if (status !== LoginStatus.SUCCESS) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <header className="chat-header">
        <div>
          Tencent Cloud IM
        </div>
        <select className="chat-header__lang-select"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <option value="zh-CN">简体中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
          <option value="ko-KR">한국어</option>
        </select>
      </header>
      <main className='chat-container'>
        {Application}
      </main>
    </div>
  );
}
