import React, { useEffect, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import TIM, { ChatSDK } from 'tim-js-sdk/tim-js-friendship';
import TIMUploadPlugin from 'tim-upload-plugin';


import { genTestUserSig } from '../debug/GenerateTestUserSig'
import LiveDemo from '../live-demo';

const init = async ():Promise<ChatSDK> => {
  return new Promise((resolve, reject) => {
    const tim = TIM.create({ SDKAppID: genTestUserSig('YOUER_USERID').sdkAppID });
    tim?.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
    const onReady = () => { resolve(tim); };
    tim.on(TIM.EVENT.SDK_READY, onReady);
    tim.login({
      userID: 'YOUER_USERID',
      userSig: genTestUserSig('YOUER_USERID').userSig,
    });
  });
}

export default function SampleChat() {
  const [tim, setTim] = useState<ChatSDK>();
  const groupID='YOUER_AVCHATROOM_GROUPID';
  const playUrl='YOUER_AVCHATROOM_PLAYER_URL';
  useEffect(() => {
    (async ()=>{
      const tim = await init()
      setTim(tim)
    })()
  }, [])

  return (
    <div style={{height: '100vh',width: '100vw'}}>
      <LiveDemo tim={tim} groupID={groupID} playUrl={playUrl} />
    </div>
  );
}
