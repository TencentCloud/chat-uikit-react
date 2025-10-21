import { useState, useLayoutEffect } from 'react';
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
  useConversationListState
} from '@tencentcloud/chat-uikit-react';
import { TUICallKit } from '@trtc/calls-uikit-react';
import { ChatDefaultContent, Tab, TabList } from '../../components';
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
  const { setActiveConversation } = useConversationListState();

  const texts = language === 'zh-CN'
    ? { chats: '会话', contacts: '联系人', emptyTitle: '暂无会话', emptySub: '选择一个会话开始聊天', error: '请检查 SDKAppID, userID, userSig, 通过开发人员工具(F12)查看具体的错误信息', loading: '登录中...' }
    : { chats: 'Chats', contacts: 'Contacts', emptyTitle: 'No conversation', emptySub: 'Select a conversation to start chatting', error: 'Please check the SDKAppID, userID, and userSig. View the specific error information through the developer tools (F12).', loading: 'Logging in...'};


  useLayoutEffect(() => {
    async function init() {
      const userID = 'administrator';
      const conversationID = `C2C${userID}`;
      setActiveConversation(conversationID);
    }

    if (status === LoginStatus.SUCCESS) {
      init();
    }
  }, [status]);


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

  if (status === LoginStatus.ERROR) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">{texts.error}</div>
      </div>
    )
  }


  if (status !== LoginStatus.SUCCESS) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">{texts.loading}</div>
      </div>
    )
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
