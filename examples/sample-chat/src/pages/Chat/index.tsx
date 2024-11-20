import { useEffect, useState } from 'react';
import {
  isPC,
  Chat,
  ChatSetting,
  Profile,
  ChatHeader,
  MessageList,
  MessageInput,
  ConversationList,
} from '@tencentcloud/chat-uikit-react';
import {
  StoreName,
  TUIStore,
  TUIConversationService,
} from "@tencentcloud/chat-uikit-engine";
import { TUILogin } from "@tencentcloud/tui-core";
import { TUICallKit, TUICallKitServer } from '@tencentcloud/call-uikit-react';
import { UIKitProvider } from '@tencentcloud/uikit-base-component-react';
import { reportEvent, REPORT_KEY } from '../../utils/aegis';
import { genTestUserSig } from '../../debug/GenerateTestUserSig';
import languageIcon from '../../assets/image/language.svg';

import './index.scss';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';

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
  const [currentConversationID, setCurrentConversationID] = useState<string>('');

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
  }

  const onCurrentConversationID = (conversationID: string) => {
    setCurrentConversationID(conversationID);
  };
  const changeLanguage = (lng: any) => {
    setCurrentLng(lng);
    setShowLngPop(!isShowLngPop);
  };

  const callStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: '999',
    transform: 'translate(-50%, -50%)',
  };

  const callButtonClicked = (callMediaType?: number) => {
    if (callMediaType === 2) {
      reportEvent({ actionKey: REPORT_KEY.VIDEO_CALL});
    } else {
      reportEvent({ actionKey: REPORT_KEY.AUDIO_CALL });
    }
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
            <Profile className="sample-chat-profile" />
            <ConversationList />
          </div>
          <Chat callButtonClicked={callButtonClicked}>
            <ChatHeader enableCall={true} />
            <MessageList />
            <MessageInput />
          </Chat>
          <ChatSetting />
        </UIKitProvider>
      </div>
      ) : (
      <div className="sample-chat-h5">
        <UIKitProvider language={currentLng.value} theme={'dark'}>
          <TUICallKit />
          {!currentConversationID && (
            <div className="sample-chat-h5-container">
              <Profile className="sample-chat-h5-profile" />
              <ConversationList />
            </div>
          )}
          {currentConversationID && (
            <>
              <Chat callButtonClicked={callButtonClicked}>
                <ChatHeader enableCall={true}/>
                <MessageList />
                <MessageInput />
              </Chat>
              <ChatSetting />
            </>
          )}
        </UIKitProvider>
      </div>
    )}
    </div>
  );
}
