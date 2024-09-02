import React from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss'
import ownerIcon from './image/owner.png';
import { useUIManager, useTUIMessageContext } from '@tencentcloud/chat-uikit-react';
import { useTUILiveContext } from "./TUILive";


export function LiveMessageName():React.ReactElement  {
    const { group } = useTUILiveContext('LiveNotification');
    const { message } = useTUIMessageContext('Prefix');
    const {
      myProfile
    } = useUIManager('TUILive');
    const isOwner = group?.ownerID === message?.from;
    const isSelf = myProfile?.userID === message?.from;

    return (
      <div className={`live-custom-name ${isOwner && 'live-owner-name'}  ${isSelf && 'live-self-name'}`}>
        <label htmlFor="content">{message?.nick || message?.from}</label>
        <span>:</span>
        {message?.from === group?.ownerID &&
          <img className='icon-owner' src={ownerIcon} alt="" />
        }
      </div>
    )
  }
