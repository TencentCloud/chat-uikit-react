import React, {  useEffect, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';
import './style.scss'
import { Avatar, Icon, IconTypes } from '@tencentcloud/chat-uikit-react';
import { useTUILiveContext } from "./TUILive";


export function LiveNotification():React.ReactElement  {

    const { group, ownerProfile } = useTUILiveContext('LiveNotification');
    const [isShow, setIsShow] = useState(true);

    useEffect(()=>{
      if (group?.notification && ownerProfile) {
        setIsShow(true);
      }
    }, [group?.notification, ownerProfile] )

    const handleCloseNotification = () => {
      setIsShow(false);
    };
    return (
      <>
      {isShow &&
        <div className='pin'>
          <main className='pin-main'>
            <aside className='pin-left'>
              <Avatar size={24} image={ownerProfile?.avatar} />
              <div className="live-owner-name">
                <h1>{ownerProfile?.nick || ownerProfile?.userID}</h1>
                <Icon type={IconTypes.OWNER} width={12} height={12} />
              </div>
            </aside>
            <p className='text'>{ group?.notification }</p>
          </main>
          <i  role="button" tabIndex={0} className='icon icon-close' onClick={handleCloseNotification}></i>
        </div>
      }
      </>
    )
  }