## Get Started

### Step 1. Create an app

1. Log in to the [Chat console](https://console.tencentcloud.com/im).
2. Click `Create Application`, enter your app name, and click `Confirm`.
![](https://cloudcache.intl.tencent-cloud.com/cms/backend-cms/f016163c56a111ee94c3525400d793d0.png)
3. After creation, you can see the status, service version, SDKAppID, creation time, tag, and expiration time of the new app on the overview page of the console.
![](https://cloudcache.intl.tencent-cloud.com/cms/backend-cms/2adc015456a211ee974d5254005f490f.png)

### Step 2. Obtain the SDKAppID and SECRETKEY
1. Click the target app card to go to the basic configuration page of the app.
2. In the Basic info area, click `Display key`, and then copy and save the key information, which is SECRETKEY.
![](https://cloudcache.intl.tencent-cloud.com/cms/backend-cms/696c6df756a211ee84f2525400494e51.png)

### Step 3. Download the source code and install dependencies
```
# Please run the following code in the terminal.
$ git clone https://github.com/TencentCloud/chat-uikit-react
$ cd chat-uikit-react/examples/sample-chat
$ npm install
```
### Step 4. Configure
1. Open the `examples/sample-chat` project and locate the `GenerateTestUserSig.js` file in `./examples/sample-chat/src/debug/GenerateTestUserSig.js`.
2. Set the `SDKAppID` and `SECRETKEY` obtained at Step 2.

### Step 5. Run the demo
```
$ npm run start
```

## Send your first message
1. Run the demo in two seperate tab pages.
2. In the search box of the demo in the first tab page, search for the login ID of the demo in the second tab page.
![](https://cloudcache.intl.tencent-cloud.com/cms/backend-cms/22dabb7156df11ee94c3525400d793d0.png)
3. Click on the user avatar to initiate a conversation.
![](https://web.sdk.qcloud.com/im/assets/4.png)
4. Enter a message in the input box and press **Enter** to send it. Emoji/Image/Video/Document messages are supported.
   ![](https://cloudcache.intl.tencent-cloud.com/cms/backend-cms/059d7f4856e011eeabd75254005810a4.png)

## Contact Us
Join a Tencent Cloud Chat developer group for Reliable technical support & Product details & Constant exchange of ideas.
- Telegram group (EN): [join](https://t.me/+1doS9AUBmndhNGNl)
- WhatsApp group (EN): [join](https://chat.whatsapp.com/Gfbxk7rQBqc8Rz4pzzP27A)
- Telegram group (ZH): [join](https://t.me/tencent_imsdk)
- WhatsApp group (ZH): [join](https://chat.whatsapp.com/IVa11ZkVmKTEwSWsAzSyik)

