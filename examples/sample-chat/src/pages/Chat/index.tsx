import { useEffect, useState } from 'react';
import {
  t,
  isPC,
  TUIChat,
  i18next,
  TUIManage,
  TUIProfile,
  TUIContact,
  UIKitProvider,
  TUIChatHeader,
  TUIMessageList,
  TUIContactInfo,
  TUIMessageInput,
  TUIConversation,
  TUIConversationList,
} from '@tencentcloud/chat-uikit-react';
import {
  StoreName,
  TUIStore,
  TUIConversationService,
} from "@tencentcloud/chat-uikit-engine";
import { TUILogin } from "@tencentcloud/tui-core";
import { TUICallKit, TUICallKitServer } from '@tencentcloud/call-uikit-react';
import { reportEvent, REPORT_KEY } from '../../utils/aegis';
import { en_US, zh_CN, ko_KR, ja_JP } from '../../locales/index';
import { genTestUserSig } from '../../debug/GenerateTestUserSig';
import chats from '../../assets/image/chats.svg';
import contacts from '../../assets/image/contacts.svg';
import languageIcon from '../../assets/image/language.svg';
import chats_selected from '../../assets/image/chats-selected.svg';
import contacts_selected from '../../assets/image/contacts-selected.svg';

import './index.scss';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';


const sampleLanguge: any = {
  'zh-CN': zh_CN,
  'en-US': en_US,
  'ko-KR': ko_KR,
  'ja-JP': ja_JP,
}

interface ISampleChatProps {
  loginUserID?: string,
}

export default function SampleChat(props: ISampleChatProps) {
  const { loginUserID } = props;
  const [currentLng, setCurrentLng] = useState({
    label: 'English',
    value: 'en-US'
  });
  const [isShowLngPop, setShowLngPop] = useState(false);
  const [moduleValue, setModuleValue] = useState("chats");
  const [currentConversationID, setCurrentConversationID] = useState<string>("");

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

  useEffect(() => {
    TUIStore.watch(StoreName.APP, {
      tasks: onTasksUpdated,
    });
    TUIStore.watch(StoreName.CONV, {
      currentConversationID: onCurrentConversationID,
    });
    return () => {
      TUIStore.unwatch(StoreName.CONV, {
        currentConversationID: onCurrentConversationID,
      });
    };
  }, [])
  function onTasksUpdated(tasks: Record<string, boolean>) {
    if (tasks.sendMessage) {
      reportEvent({ actionKey: REPORT_KEY.SEND_FIRST_MESSAGE });
    }
  }
  const init = () => {
    const userID = loginUserID || `test-${Math.ceil(Math.random() * 10000)}`;
    const loginInfo: any = {
      SDKAppID: genTestUserSig(userID).SDKAppID,
      userID,
      userSig: genTestUserSig(userID).userSig,
      useUploadPlugin: true,
    };
    TUILogin.login(loginInfo).then((res: any) => {
      createChat();
      reportEvent({ actionKey: REPORT_KEY.LOGIN_SUCCESS });
    }).catch(() => {
      reportEvent({ actionKey: REPORT_KEY.LOGIN_FAIL });
    });
  }

  init();
  TUICallKitServer.setLanguage('en');

  async function createChat() {
    // 1v1 chat: conversationID = `C2C${userID}`
    // group chat: conversationID = `GROUP${groupID}`
    const userID = 'administrator'; // userID: Recipient of the Message userID, Get it from Step 5
    const conversationID = `C2C${userID}`;
    await TUIConversationService.getConversationProfile(conversationID);
  };

  for (const key in sampleLanguge) {
    if (sampleLanguge.hasOwnProperty(key)) {
      const languageResources = sampleLanguge[key];
      i18next.addResourceBundle(key, 'translation', languageResources);}
  }

  const onCurrentConversationID = (conversationID: string) => {
    setCurrentConversationID(conversationID);
  };
  const changeLanguage = (lng: any) => {
    setCurrentLng(lng);
    i18next.changeLanguage(lng.value);
    setShowLngPop(!isShowLngPop);
  };

  const switchTabbar = (value: string) => {
    setModuleValue(value);
    TUIConversationService.switchConversation('');
  };

  const callStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: '999',
    transform: 'translate(-50%, -50%)',
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
      {isPC ? (
        <div className="sample-chat">
        <UIKitProvider language={currentLng.value} theme={'light'}>
          <TUICallKit style={callStyle} />
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
                        moduleValue === item.value ? item.selectedIcon : item.icon
                      }
                      alt=""
                    />
                    <p
                      className={`sample-chat-tab-text ${moduleValue === item.value ? "sample-chat-tab-active" : ""
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
          {moduleValue === "chats" && (
            <>
              <TUIChat>
                <TUIChatHeader enableCall={true} />
                <TUIMessageList />
                <TUIMessageInput />
              </TUIChat>
              <TUIManage></TUIManage>
            </>
          )}
          {moduleValue === "contacts" && (
            <TUIContact>
              <TUIContactInfo
                showChats={() => {
                  setModuleValue("chats");
                }}
              ></TUIContactInfo>
            </TUIContact>
          )}

        </UIKitProvider>
      </div>
      ) : (
      <div className="sample-chat-h5">
        <UIKitProvider language={currentLng.value} theme={'dark'}>
          <TUICallKit />
          {!currentConversationID && (
            <div className="sample-chat-h5-container">
              <TUIProfile className="sample-chat-h5-profile" />
              <TUIConversation>
                <TUIConversationList/>
              </TUIConversation>
            </div>
          )}
          {currentConversationID && (
            <>
              <TUIChat>
                <TUIChatHeader enableCall={true}/>
                <TUIMessageList />
                <TUIMessageInput />
              </TUIChat>
              <TUIManage></TUIManage>
            </>
          )}
        </UIKitProvider>
      </div>
    )}
    </div>
  );
}
