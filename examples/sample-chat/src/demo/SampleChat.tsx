import React, { useEffect, useState } from 'react';
import {
  TUIKit,
  TUIConversationList,
  TUIChat,
  TUIChatHeader,
  TUIMessageList,
  TUIMessageInput,
  TUIProfile,
  TUIConversation,
  TUIManage,
  TUIContact,
  TUIContactInfo,
  i18next,
  t,
} from '@tencentcloud/chat-uikit-react';
import TencentCloudChat, { ChatSDK } from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';

import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss';
import chats from './assets/image/chats.svg';
import chats_selected from './assets/image/chats-selected.svg';
import contacts from './assets/image/contacts.svg';
import contacts_selected from './assets/image/contacts-selected.svg';
import languageIcon from './assets/image/language.svg';
import { sampleResources } from '../locales/index';
import { genTestUserSig } from '../debug/GenerateTestUserSig'

// 追加 sample 语言包
if (i18next.language === 'zh') {
  i18next.addResources(i18next.language, 'translation', sampleResources?.zh);
} else {
  i18next.addResources(i18next.language, 'translation', sampleResources?.en);
}

const init = async ():Promise<ChatSDK> => {
  return new Promise((resolve, reject) => {
    const userID = `test-${Math.ceil(Math.random() * 10000)}`;
    console.warn('your userID ->', userID);
    const chat = TencentCloudChat.create({ SDKAppID: genTestUserSig(userID).SDKAppID });
    chat?.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
    const onReady = () => { resolve(chat); };
    chat.on(TencentCloudChat.EVENT.SDK_READY, onReady);
    chat.login({
      userID,
      userSig: genTestUserSig(userID).userSig,
    });
  });
}

export default function SampleChat() {
  const [moduleValue, setModuleValue] = useState("chats");
  const [chat, setChat] = useState<ChatSDK>();
  const [currentLng, setCurrentLng] = useState({              // 支持切换 zh / en，默认支持 en
    label: 'English',
    value: 'en'
  });
  const [isShowLngPop, setShowLngPop] = useState(false);
  const tabbarList = [
    {
      id: 1,
      name: 'chats',
      icon: chats,
      selectedIcon: chats_selected,
      value: 'chats'
    },
    {
      id: 2,
      name: 'contacts',
      icon: contacts,
      selectedIcon: contacts_selected,
      value: 'contacts'
    }
  ];

  const languageList = [
    {
      label: '简体中文',
      value: 'zh'
    },
    {
      label: 'English',
      value: 'en'
    }
  ]

  useEffect(() => {
    // 默认支持 en
    (async ()=>{
      const chat = await init()
      setChat(chat)
    })()
  }, [])

  const switchTabbar = (value: string) => {
    setModuleValue(value);
  };

  const changeLanguage = (lng: any) => {
    setCurrentLng(lng);
    i18next.changeLanguage(lng.value);
    setShowLngPop(!isShowLngPop);
  };

  return (
    <div className="sample-demo">
      <div className="chat-header">
        <div className="language-container">
          <div
            className="title-container"
            onClick={() => setShowLngPop(!isShowLngPop)}
          >
            <img className="language-icon" src={languageIcon} alt="" />
            <p className="language-text">{currentLng.label}</p>
          </div>
          {isShowLngPop && (
            <div className="language-item-container">
              {" "}
              {languageList.map((item, index) => {
                const key = `${item.value}${index}`;
                return (
                  <p
                    className="language-text"
                    role="menuitem"
                    tabIndex={index}
                    key={key}
                    onClick={() => {
                      changeLanguage(item);
                    }}
                  >
                    {item.label}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-demo">
          <TUIKit chat={chat} language={currentLng.value}>
            {/* 左侧 list 显示 */}
            <div className="sample-chat-left-container">
              <TUIProfile className="sample-chat-profile" />
              <div className="sample-chat-tab">
                {tabbarList.map((item: any) => {
                  return (
                    <div
                      className="sample-chat-tab-container"
                      key={item.id}
                      onClick={() => {
                        switchTabbar(item.value);
                      }}
                    >
                      <img
                        src={
                          moduleValue === item.value
                            ? item.selectedIcon
                            : item.icon
                        }
                        alt=""
                      />
                      <p
                        className={`sample-chat-tab-text ${
                          moduleValue === item.value
                            ? "sample-chat-tab-active"
                            : ""
                        }`}
                      >
                        {t(item.name)}
                      </p>
                    </div>
                  );
                })}
              </div>
              {moduleValue === "chats" && (
                <TUIConversation>
                  <TUIConversationList />
                </TUIConversation>
              )}
              {moduleValue === "contacts" && <TUIContact />}
            </div>
            {/* 右侧对应内容显示 */}
            {moduleValue === "chats" && (
              <>
                <TUIChat>
                  <TUIChatHeader />
                  <TUIMessageList />
                  <TUIMessageInput />
                </TUIChat>
                <TUIManage></TUIManage>
              </>
            )}
            {moduleValue === "contacts" && (
              <TUIContact>
                <TUIContactInfo
                  showChat={() => {
                    setModuleValue("chats");
                  }}
                ></TUIContactInfo>
              </TUIContact>
            )}
          </TUIKit>
        </div>
      </div>
    </div>
  );
}
