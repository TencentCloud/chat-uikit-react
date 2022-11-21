# [Chat UIKit React](https://www.tencentcloud.com/document/product/1047/34279/)
>Chat UIKit 是基于腾讯云 IM SDK 的一款 UI 组件库，它提供了一些通用的 UI 组件，包含会话、聊天、关系链、群组、音视频通话等功能。
基于 UI 组件您可以像搭积木一样快速搭建起自己的业务逻辑。
Chat UIKit  中的组件在实现 UI 功能的同时，会调用 IM SDK 相应的接口实现 IM 相关逻辑和数据的处理，因而开发者在使用 Chat UIKit  时只需关注自身业务或个性化扩展即可。

<img align="right" src="https://qcloudimg.tencent-cloud.cn/raw/4562be8179a1534efb17d33428239c82.png?auto=format,enhance" width="50%" />

### Quick Links
- [Demo App](https://web.sdk.qcloud.com/im/demo/intl/index.html)
- [Client API](https://www.tencentcloud.com/document/product/1047/33999)
- [Free Demos](https://www.tencentcloud.com/document/product/1047/34279)
- [FAQ](https://www.tencentcloud.com/document/product/1047/34455)
- [GitHub Source](https://github.com/TencentCloud/chat-uikit-react)
- [Generating UserSig](https://www.tencentcloud.com/document/product/1047/34385)
## Example App
我们已经构建了用于展示聊天功能的实例演示程序，您可以在我们的网站上预览这些 [demo](https://web.sdk.qcloud.com/im/demo/intl/index.html)，另外在 GitHub 中也提供相关的[开源代码](https://github.com/TencentCloud/chat-uikit-react)。

![img.png](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/home.png)

## 跑通demo

### 步骤一：下载源码
```
# Run the code in CLI
$ git clone https://github.com/TencentCloud/chat-uikit-react
# Go to the project  
$ cd chat-uikit-react
# Install dependencies of the demo
$ npm install && cd examples/sample-chat && npm install
```
### 步骤二：配置 demo
1. 打开`examples/sample-chat`项目，通过路径`./examples/sample-chat/src/debug/GenerateTestUserSig.js`找到`GenerateTestUserSig.js`文件。
2. 在`GenerateTestUserSig.js`文件中设置 `SDKAPPID` 和 `SECRETKEY` ，其值可以在[IM控制台](https://console.tencentcloud.com/im)中获取。 点击目标应用卡片，进入其配置页面。
   ![](https://qcloudimg.tencent-cloud.cn/raw/8d469e975f1ca5a2f3dbc9c6fe8774f5.png)
3. 在 **Basic Information** 区域，点击  **Display key**，将密钥信息复制并保存到 GenerateTestUserSig 文件中。
>!
>- 本文提到的生成 UserSig 的方案是在客户端代码中配置 SECRETKEY，该方法中 SECRETKEY 很容易被反编译逆向破解，一旦您的密钥泄露，攻击者就可以盗用您的腾讯云流量，因此**该方法仅适合本地跑通 Demo 和功能调试。**
>- 正确的 UserSig 签发方式是将 UserSig 的计算代码集成到您的服务端，并提供面向 App 的接口，在需要 UserSig 时由您的 App 向业务服务器发起请求获取动态 UserSig。更多详情请参见 [服务端生成 UserSig](https://www.tencentcloud.com/document/product/1047/34385)。

### 步骤三：启动项目
```
# Launch the project
$ npm run start
```

### 步骤四：发送您的第一条消息
1. 项目启动成功后，点击“+”图标，进行创建会话。
2. 在输入框中搜索另一个用户的 userID。
3. 点击用户头像发起会话。
4. 在输入框输入消息，按下"enter"键发送。
   ![](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/chat.gif)

## 集成 chat-uikit-react

### 步骤一：Installation
```
$ npm install @tencentcloud/chat-uikit-react
```
### 步骤二：Usage
```tsx
import React, { useEffect, useState } from 'react';
import { TUIKit } from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';

// 生成tim实例对象并完成登陆
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
