import React, { useEffect, useState } from 'react';
import {
  TUIKit,
  i18next,
} from '@tencentcloud/chat-uikit-react';
import { TUILogin } from "@tencentcloud/tui-core";
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss';
import languageIcon from './assets/image/language.svg';
import { sampleResources } from '../locales/index';
import { genTestUserSig } from '../debug/GenerateTestUserSig';
import { ChatSDK } from '@tencentcloud/chat';
if (i18next.language === 'zh') {
  i18next.addResources(i18next.language, 'translation', sampleResources?.zh);
} else {
  i18next.addResources(i18next.language, 'translation', sampleResources?.en);
}

export default function SampleChat() {
  const [chat, setChat] = useState<ChatSDK>();
  const [currentLng, setCurrentLng] = useState({
    label: 'English',
    value: 'en'
  });
  const [isShowLngPop, setShowLngPop] = useState(false);


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
    });
  }
  useEffect(() => {
    init();
  }, [])

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
          <TUIKit chat={chat} language={currentLng.value}></TUIKit>
        </div>
      </div>
    </div>
  );
}
