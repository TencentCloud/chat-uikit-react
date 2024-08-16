import { useEffect, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import { TUILogin } from "@tencentcloud/tui-core";
import { StoreName, TUIStore } from '@tencentcloud/chat-uikit-engine';
import { ChatSDK } from '@tencentcloud/chat';
import LiveDemo from '../live-demo';

import { genTestUserSig } from '../debug/GenerateTestUserSig'
import { reportEvent, REPORT_KEY } from '../utils/aegis';

export default function SampleChat() {
  const [chat, setChat] = useState<ChatSDK>();
  // Group Management, please refer to https://www.tencentcloud.com/document/product/1047/48465
  const groupID = 'live-room-1';
  // Please replace it with your own live streaming URL
  const playUrl = 'https://web.sdk.qcloud.com/im/demo/intl/live-demo-video.mp4';

  const init = () => {
    const userID = `test-${Math.ceil(Math.random() * 10000)}`;
    const loginInfo = {
      SDKAppID: genTestUserSig(userID).SDKAppID,
      userID,
      userSig: genTestUserSig(userID).userSig,
    };
    TUILogin.login(loginInfo).then(() => {
      const { chat } = TUILogin.getContext();
      setChat(chat);
      reportEvent({ actionKey: REPORT_KEY.LOGIN_SUCCESS });
    }).catch(() => {
      reportEvent({ actionKey: REPORT_KEY.LOGIN_FAIL });
    });
  }

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

  return (
    <div style={{height: '100vh',width: '100vw'}}>
      <LiveDemo chat={chat} groupID={groupID} playUrl={playUrl} />
    </div>
  );
}
