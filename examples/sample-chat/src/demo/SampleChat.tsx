import { useEffect, useState } from 'react';
import {
  UIKitProvider,
  TUIConversationList,
  TUIChat,
  TUIManage,
  i18next,
} from '@tencentcloud/chat-uikit-react';
import { TUILogin } from "@tencentcloud/tui-core";
import { ChatSDK } from '@tencentcloud/chat';
import { StoreName, TUIStore } from '@tencentcloud/chat-uikit-engine';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss';
import languageIcon from './assets/image/language.svg';
import { en_US, zh_CN, ko_KR, ja_JP } from '../locales/index';
import { genTestUserSig } from '../debug/GenerateTestUserSig';
import { reportEvent, REPORT_KEY } from './utils/aegis';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';

const sampleLanguge: any = {
  'zh-CN': zh_CN,
  'en-US': en_US,
  'ko-KR': ko_KR,
  'ja-JP': ja_JP,
}
export default function SampleChat() {
  const [chat, setChat] = useState<ChatSDK>();
  const [currentLng, setCurrentLng] = useState({
    label: 'English',
    value: 'en-US'
  });
  const [isShowLngPop, setShowLngPop] = useState(false);


  const languageList = [
    {
      label: '简体中文',
      value: 'zh-CN'
    },
    {
      label: 'English',
      value: 'en-US'
    },
    {
      label: '日本語',
      value: 'ja-JP'
    },
    {
      label: '한국어',
      value: 'ko-KR'
    },
  ]

  const init = () => {
    const userID = `test-${Math.ceil(Math.random() * 10000)}`;
    const loginInfo: any = {
      SDKAppID: genTestUserSig(userID).SDKAppID,
      userID,
      userSig: genTestUserSig(userID).userSig,
      useUploadPlugin: true,
    };
    TUILogin.login(loginInfo).then((res: any) => {
      const { chat } = TUILogin.getContext();
      setChat(chat);
      openChat();
      reportEvent({ actionKey: REPORT_KEY.LOGIN_SUCCESS });
    }).catch(() => {
      reportEvent({ actionKey: REPORT_KEY.LOGIN_FAIL });
    });
  }

  function openChat() {
    // 1v1 chat: conversationID = `C2C${userID}`
    // group chat: conversationID = `GROUP${groupID}`
    const userID = 'administrator'; // userID: Recipient of the Message userID, Get it from Step 5
    const conversationID = `C2C${userID}`;
    TUIConversationService.switchConversation(conversationID);
  };


  function onTasksUpdated(tasks: Record<string, boolean>) {
    if (tasks.sendMessage) {
      reportEvent({ actionKey: REPORT_KEY.SEND_FIRST_MESSAGE });
    }
  }

  useEffect(() => {
    init();
    TUIStore.watch(StoreName.APP, {
      tasks: onTasksUpdated,
    });
  }, [])

  const changeLanguage = (lng: any) => {
    setCurrentLng(lng);
    i18next.addResources(i18next.language, 'translation', sampleLanguge[lng.value]);
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
        <UIKitProvider chat={chat} language={currentLng.value}>
          <TUIConversationList />
          <TUIChat />
          <TUIManage />
        </UIKitProvider>
      </div>
    </div>
  );
}
