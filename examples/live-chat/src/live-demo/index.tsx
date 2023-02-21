import React, { useEffect, useState } from 'react';
import {
  TUIKit,
  TUIChat,
  TUIMessageInput,
  TUIMessageList,
  TUIChatHeader,
} from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import  { ChatSDK } from 'tim-js-sdk/tim-js-friendship';
import { GroupMember, Message } from 'tim-js-sdk';

import overlapping from './image/overlapping.png';
import expand from './image/expand.png';
import member from './image/member.png';
import backChat from './image/backChat.png';
import admin from './image/admin.png';
import audience from './image/audience.png';

import './style.scss'

import {
  TUILive,
  TUILiveMemberList,
  TUILiveMemberListItemParams,
} from './TUILive';

import { LiveGift } from './live-gift';
import { LiveMessageProfix } from './live-message-profix';
import { LiveMessageName } from './live-message-name';
import { LiveNotification } from './live-notification';

export default function LiveDemo(props: any) {
  const {
    groupID,
    playUrl,
    className,
  } = props;

  // group for memeberList 
  const memberGroupList:Array<TUILiveMemberListItemParams> = [
    {
      title:<><img className="icon-title" src={admin} alt='' /> Administrator</> ,
      name:'Administrator',
      filter: (list: Array<GroupMember>, ownerProfile: GroupMember)=>{
        return [ownerProfile];
      },
    },
    {
      title:<><img className="icon-title" src={audience} alt='' /> Audience</> ,
      name:'Audience',
      filter: (list: Array<GroupMember>, ownerProfile: GroupMember)=>{
        return list || [];
      },
    }
  ]

  // TUIMessage plugin config
  const messagePluginConfig = {
    quote: {
      isShow: false,
    },
    forward: {
      isShow: false,
    },
    revoke: {
      isShow: false,
    },
    delete: {
      isShow: false,
    },
    copy: {
      isShow: false,
    }
  }

  // TUIMessage config
  const messageConfig = {
    className: 'live-message',
    isShowTime: false,
    isShowRead: false,
    isShowPlugin: false,
    plugin: {
      config: messagePluginConfig
    },
    prefix: <LiveMessageProfix />,
    customName: <LiveMessageName />,
    isShowMyAvatar: true,
  }

  // TUIMessageInput config
  const TUIMessageInputConfig = {
    className: 'live-input',
    pluginConfig: {
      isImagePicker: false,
      isVideoPicker: false,
      isFilePicker: false,
    },
    isTransmitter: true
  }

  const [tim, setTim] = useState<ChatSDK>();
  const [isChatShow, setIsChatShow] = useState<boolean>(true);
  const [isMembersShow, setIsMembersShow] = useState<boolean>(false);
  const [customData, setCustomData] = useState(JSON.stringify({ mode: 'live', vip: 1 }));

  useEffect(() => {
    (async ()=>{
      if (props?.tim && !tim) {
        const { tim } = props;
        setTim(tim)
      }
    })()
  });

  // open / close chat module
  const toggleChat = () => {
    setIsChatShow(!isChatShow);
    setIsMembersShow(false);
  }

  //  open / close memberList module
  const toggleMemberList = () => {
    setIsMembersShow(!isMembersShow);
  }


  // gift callback
  const handleTUIGift = (level:number) => {
    const data = JSON.parse(customData);
    data.vip = level;
    setCustomData(JSON.stringify(data))
  }

  return (
    <div className={`live ${className}`}>
      <TUIKit tim={tim}>
        <TUILive
          className='live-player'
          menuIcon={!isChatShow ? <img className="icon icon-expand" src={expand} alt='Expand' onClick={toggleChat} /> : <></>}
          url={playUrl}
          groupID={groupID}
          memberGroupList={memberGroupList}
        >
          <TUIChat
            className={`live-chat ${!isChatShow && 'live-none'}`}
            cloudCustomData={customData}
            messageConfig={messageConfig}
            TUIMessageInputConfig={TUIMessageInputConfig}
          >
            <TUIChatHeader
              title="Live Chat"
              avatar={<img className="icon icon-overlapping" src={overlapping} alt='Overlapping' onClick={toggleChat} />}
              headerOpateIcon={<img className="icon icon-member" src={member} alt='member' onClick={toggleMemberList} />} />
            {<LiveNotification />}
            <TUIMessageList />
            <LiveGift callback={handleTUIGift} />
            <TUIMessageInput />
            {isMembersShow &&
              <div className='memeberList'>
                <header>
                  <img className="icon icon-overlapping" src={overlapping} alt='Overlapping' onClick={toggleChat} />
                  <h1>COMMUNITY</h1>
                  <img className="icon icon-backChat" src={backChat} alt='backChat' onClick={toggleMemberList} />
                </header>
                <TUILiveMemberList />
              </div>}
          </TUIChat>
        </TUILive>
    </TUIKit>
    </div>
  );
}
