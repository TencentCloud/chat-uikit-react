import React, { useEffect, useState } from 'react';
import { TUIKit } from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import TencentCloudChat, { ChatSDK } from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';


import { genTestUserSig } from '../debug/GenerateTestUserSig'

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
  useEffect(() => {
    (async ()=>{
      const chat = await init()
      setChat(chat)
    })()
  }, [])

  return (
    <div style={{height: '100vh',width: '100vw'}}>
      <TUIKit chat={chat}></TUIKit>
    </div>
  );
}
