_English | [简体中文](readme.zh_cn.md)_
# [chat-uikit-react](https://www.tencentcloud.com/document/product/1047/34279/)
>chat-uikit-react is a UI component library based on Tencent Cloud IM SDK. It provides universal UI components to offer features such as conversation, chat, relationship chain, group, and audio/video call features.
With these UI components, you can quickly build your own business logic.
When implementing UI features, components in chat-uikit-react will also call the corresponding APIs of the IM SDK to implement IM-related logic and data processing, allowing developers to focus on their own business needs or custom extensions.

## Demos
We have built demos to illustrate the chatting feature.

|  | sample-chat | live-chat |
| ------ | ------ | ------ |
|  | ![img.png](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/home.png) | ![img.png](https://web.sdk.qcloud.com/im/demo/TUIkit/react-static/images/live-demo.png) |
| url | [sample-chat](https://web.sdk.qcloud.com/im/demo/intl/index.html) | [live-chat](https://web.sdk.qcloud.com/im/demo/intl/index.html?scene=live) |
| demo code | [sample-chat-code](https://github.com/TencentCloud/chat-uikit-react/tree/main/examples/sample-chat) | [live-chat-code](https://github.com/TencentCloud/chat-uikit-react/tree/main/examples/live-chat) |

 You can preview these [demos](https://web.sdk.qcloud.com/im/demo/intl/index.html) on our website and obtain their [open source code](https://github.com/TencentCloud/chat-uikit-react) in GitHub.


## Running Demo

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

### Quick links
- [Web demo](https://web.sdk.qcloud.com/im/demo/intl/index.html)
- [Client APIs](https://www.tencentcloud.com/document/product/1047/33999)
- [Free demo download](https://www.tencentcloud.com/document/product/1047/34279)
- [FAQs](https://www.tencentcloud.com/document/product/1047/34455)
- [Source code in GitHub](https://github.com/TencentCloud/chat-uikit-react)
- [Generating UserSig](https://www.tencentcloud.com/document/product/1047/34385)
