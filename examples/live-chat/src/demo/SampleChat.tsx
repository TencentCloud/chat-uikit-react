import React, { useEffect, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import TencentCloudChat, { ChatSDK } from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';


import { genTestUserSig } from '../debug/GenerateTestUserSig'
import LiveDemo from '../live-demo';

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
  const [chat, setChat] = useState<ChatSDK>();
  // Group Management, please refer to https://www.tencentcloud.com/document/product/1047/48465
  const groupID = 'live-room-1';
  // Please replace it with your own live streaming URL
  const playUrl = 'https://web.sdk.qcloud.com/im/demo/intl/live-demo-video.mp4';
  useEffect(() => {
    (async ()=>{
      const chat = await init()
      setChat(chat)
    })()
  }, [])

  return (
    <div style={{height: '100vh',width: '100vw'}}>
      <LiveDemo chat={chat} groupID={groupID} playUrl={playUrl} />
    </div>
  );
}
