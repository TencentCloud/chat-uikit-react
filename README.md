# Chat UIKit React for [Tencent Cloud IM](https://www.tencentcloud.com/document/product/1047/34279/)
>The web demo is implemented based on the IM chat-uikit-react. chat-uikit-react provides features such as management of conversations, chats, groups, and profiles. With chat-uikit-react, you can quickly build your own business logic.

<img align="right" src="https://qcloudimg.tencent-cloud.cn/raw/4562be8179a1534efb17d33428239c82.png?auto=format,enhance" width="50%" />

### Quick Links
- [Demo App](https://web.sdk.qcloud.com/im/demo/intl/index.html)
- [Client API](https://www.tencentcloud.com/document/product/1047/33999)
- [Free Demos](https://www.tencentcloud.com/document/product/1047/34279)
- [FAQ](https://www.tencentcloud.com/document/product/1047/34455)
- [GitHub Source](https://github.com/TencentCloud/chat-uikit-react)
- [Generating UserSig](https://www.tencentcloud.com/document/product/1047/34385)
## Example App
We have built sample demo applications showcasing chat use cases,You can preview these
[demo](https://web.sdk.qcloud.com/im/demo/intl/index.html) on our website.
Also, the code is [open source](https://github.com/TencentCloud/chat-uikit-react).

![img.png](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/home.png)

## Try chat-uikit-react

### Step 1.Installation
```
$ npm i @tencentcloud/chat-uikit-react
```
### Step 2.Usage
```tsx
import React, { useEffect, useState } from 'react';
import { TUIKit } from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import TIM, { TIMUploadPlugin } from 'tim-js-sdk';

const init = async () => {
   return new Promise((resolve, reject) => {
      const tim = TIM.create({ SDKAppID: 000 });
      tim?.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
      const onReady = () => { resolve(tim); };
      tim.on(TIM.EVENT.SDK_READY, onReady);
      tim.login({
         userID: 'xxx',
         userSig: 'xxx',
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
## Customizing Styles
The preferred method for overriding the pre-defined styles in the library is to two step process. First, import our bundled CSS into the file where you instantiate your chat application. Second, locate any TencentCloud styles you want to override using either the browser inspector or by viewing the library code. You can then add selectors to your local CSS file to override our defaults. For example:
```tsx
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './App.css';
```

## Running the demo
### Step 1. Download the source code
```
# Run the code in CLI
$ git clone https://github.com/TencentCloud/chat-uikit-react
# Go to the project  
$ cd chat-uikit-react
# Install dependencies of the demo
$ npm install && cd examples/sample-chat && npm install
```
### Step 2. Initialize the demo
1. Open the project, and find the `GenerateTestUserSig.js` file via the path `/src/debug/GenerateTestUserSig.js`.
2. Set required parameters in the `GenerateTestUserSig` file, where `SDKAppID` and `Key` can be obtained in the IM console. Click the target app card to go to its basic configuration page.
   ![](https://qcloudimg.tencent-cloud.cn/raw/8d469e975f1ca5a2f3dbc9c6fe8774f5.png)
3. In the **Basic Information** area, click **Display key**, and copy and save the key information to the `GenerateTestUserSig` file.
> In this document, the method to obtain `UserSig` is to configure a `SECRETKEY` in the client code.
> In this method, the `SECRETKEY` is vulnerable to
> decompilation and reverse engineering. Once
> your `SECRETKEY` is disclosed, attackers
> can steal your Tencent Cloud traffic. Therefore,
> **this method is only suitable for locally running
> a demo project and feature debugging.** The correct
> `UserSig` distribution method is to integrate the
> calculation code of `UserSig` into your server and
> provide an application-oriented API. When `UserSig`
> is needed, your application can send a request
> to the business server for a dynamic `UserSig`.
> For more information, see the "Calculating UserSig
> on the Server" section of [Generating UserSig](https://www.tencentcloud.com/document/product/1047/34385).

### Step 3. Launch the project
```
# Launch the project
$ npm run start
```

## Contributing
We welcome code changes that improve this library or fix a problem. Please make sure to follow all best practices and add tests, if applicable, before submitting a pull request on GitHub. We are pleased to merge your code into the official repository if it meets a need.

