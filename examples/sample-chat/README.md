_English | [简体中文](README.zh_cn.md)_
# [chat-uikit-react](https://www.tencentcloud.com/document/product/1047/34279/)
>chat-uikit-react is a UI component library based on Tencent Cloud IM SDK. It provides universal UI components to offer features such as conversation, chat, relationship chain, group, and audio/video call features.
With these UI components, you can quickly build your own business logic.
When implementing UI features, components in chat-uikit-react will also call the corresponding APIs of the IM SDK to implement IM-related logic and data processing, allowing developers to focus on their own business needs or custom extensions.

<img align="right" src="https://qcloudimg.tencent-cloud.cn/raw/4562be8179a1534efb17d33428239c82.png?auto=format,enhance" width="50%" />

### Quick Links
- [Demo App](https://web.sdk.qcloud.com/im/demo/intl/index.html)
- [Client API](https://www.tencentcloud.com/document/product/1047/33999)
- [Free Demos](https://www.tencentcloud.com/document/product/1047/34279)
- [FAQ](https://www.tencentcloud.com/document/product/1047/34455)
- [GitHub Source](https://github.com/TencentCloud/chat-uikit-react)
- [Generating UserSig](https://www.tencentcloud.com/document/product/1047/34385)
## Example App
We have built demos to illustrate the chatting feature.， You can preview these [demos](https://web.sdk.qcloud.com/im/demo/intl/index.html) on our website and obtain their [open source code](https://github.com/TencentCloud/chat-uikit-react) in GitHub.

![img.png](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/home.png)

## 跑通demo

### Step 1. Download the source code
```
# Run the code in CLI
$ git clone https://github.com/TencentCloud/chat-uikit-react
# Go to the project  
$ cd chat-uikit-react
# Install dependencies of the demo
$ npm install && cd examples/sample-chat && npm install
```
### Step 2. Configure demo
1. Open the `examples/sample-chat` project and locate the `GenerateTestUserSig.js` file in `./examples/sample-chat/src/debug/GenerateTestUserSig.js`.
2. In the `GenerateTestUserSig.js` file, set `SDKAPPID` and `SECRETKEY`, whose values can be obtained in the [IM console](https://console.tencentcloud.com/im). Click the card of the target app to go to its configuration page.
   ![](https://qcloudimg.tencent-cloud.cn/raw/8d469e975f1ca5a2f3dbc9c6fe8774f5.png)
3. In the **Basic Information** area, click **Display key**, and copy and save the key information to the `GenerateTestUserSig` file.
>!
>- In this document, the method to obtain `UserSig` is to configure the secret key in the client code. In this method, the secret key is vulnerable to decompilation and reverse engineering. Once your secret key is leaked, attackers can steal your Tencent Cloud traffic. Therefore, **this method is only suitable for locally running a demo project and debugging.**
>- The best practice is to integrate the calculation code of `UserSig` into your server and provide an application-oriented API. When `UserSig` is needed, your application can send a request to your server for a dynamic `UserSig`. For more information, see [How do I calculate `UserSig` during production?](https://www.tencentcloud.com/document/product/1047/34385).

### Step 3. Launch the project
```
# Launch the project
$ cd examples/sample-chat
$ npm run start
```

### Step 4. Send your first message
1. After the product is launched, click the **+** icon to create a conversation.
2. Search for another user's userID in the input box.
3. Click the user's profile photo to initiate a conversation.
4. Enter a message in the input box and press **Enter** to send it.
   ![](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/chat-English.gif)

## use chat-uikit-react

### Step 1：Installation
```
$ npm install @tencentcloud/chat-uikit-react
```
### Step 2：Usage
```tsx
import React, { useEffect, useState } from 'react';
import { TUIKit } from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';

// Generate a tim instance object and complete the login
const init = async () => {
   return new Promise((resolve, reject) => {
      const tim = TIM.create({ SDKAppID: 0}); // YOUR SDKAppID
      tim?.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
      const onReady = () => { resolve(tim); };
      tim.on(TIM.EVENT.SDK_READY, onReady);
      tim.login({
         userID: 'YOUR USERID',
         userSig: 'YOUR USERSIG',
      });
   });
}

export function SampleChat() {
   const [tim, setTim] = useState<TIM>();
   useEffect(() => {
      (async ()=>{
         const tim = await init()
         setTim(tim)
      })()
   }, [])

   return (
           <div style={{height: '100vh',width: '100vw'}}>
              <TUIKit tim={tim}></TUIKit>
           </div>
   );
}
```
