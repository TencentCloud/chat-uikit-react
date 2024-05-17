import React, { useEffect, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import { TUILogin } from "@tencentcloud/tui-core";

import { genTestUserSig } from '../debug/GenerateTestUserSig'
import LiveDemo from '../live-demo';
import { ChatSDK } from '@tencentcloud/chat';

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
    });
  }
  useEffect(() => {
    init();
  }, [])

  return (
    <div style={{height: '100vh',width: '100vw'}}>
      <LiveDemo chat={chat} groupID={groupID} playUrl={playUrl} />
    </div>
  );
}
