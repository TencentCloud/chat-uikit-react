import React, { PropsWithChildren } from 'react';
import {
  useTUIMessageContext
} from '@tencentcloud/chat-uikit-react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';

import './style.scss'

interface LeaveConfigReturn {
  color?: string,
  linearStartColor?: string,
  linearStopColor?: string,
  linearText?: Boolean,
}

function handleLeaveConfig(leave:number):LeaveConfigReturn {
  let config = {};
  const leaveColor =  {
    '1-3': {
      color: '#FF9500',
      linearStartColor: '#FF9500',
      linearStopColor: '#FF9500',
      linearText: false,
    },
    '4-50': {
      color: '#FF9500',
      linearStartColor: '#EF6033',
      linearStopColor: '#EF8233',
      linearText: false,
    },
    '51-': {
      color: '#FFFFFF',
      linearStartColor: '#000000',
      linearStopColor: '#6D6051',
      linearText: true,
    },
  };
  Object.entries(leaveColor).map((item)=>{
    const [key, value] = item;
    const [min, max] = key.split('-');
    if (leave >= Number(min) && (!max || leave <= Number(max))) {
      config = value;
    }
    return item;
  })
  return config;
}

interface  LiveMessageProfixProps {
  callback?: (data:any)=>void,
}

export function LiveMessageProfix<T extends LiveMessageProfixProps>(props: PropsWithChildren<T>):React.ReactElement   {
    const { message } = useTUIMessageContext('PreLiveMessageProfixfix');
    let cloudData = {
      mode: 'live',
      vip: 0
    };
    
    if (message?.cloudCustomData) {
      try {
        cloudData = JSON.parse(message?.cloudCustomData);
      } catch (error) {
        //  console.error(`JSON.parse error ${error}`);
      }
    }
  
    if (cloudData?.mode === 'live') {
      const config = handleLeaveConfig(cloudData?.vip);
      const textStyle = {
        border: !config?.linearText ? `1px solid ${config?.color}` : '',
        color: config?.color,
        background: config?.linearText && `linear-gradient(180deg, ${config.linearStartColor} 0%, ${config.linearStopColor} 100%)`,
      }
      
      return <div className="live-message-prefix">
        <span className='leave' style={textStyle}>{cloudData?.vip > 0 ? `LV ${cloudData?.vip}` : 'visitor' }</span>
        {cloudData?.vip > 0 &&
          <svg className="vip-box" width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <linearGradient id={`grad-${message?.ID}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{
                    stopColor: config.linearStartColor,
                    stopOpacity: 1
                  }} />
                  <stop offset="100%" style={{
                    stopColor: config.linearStopColor,
                    stopOpacity: 1
                  }} />
                </linearGradient>
              </defs>
            <path
              d="M0.666145 3.90635L2.38419 0.62034C2.46228 0.471087 2.61678 0.377502 2.78523 0.377502H8.34488C8.51331 0.377502 8.66779 0.471088 8.74584 0.62034L10.4639 3.90635C10.5506 4.07212 10.5263 4.27415 10.4028 4.41469L5.90491 9.53338C5.74003 9.72112 5.45418 9.73964 5.26644 9.57477C5.25177 9.56188 5.23794 9.54805 5.22505 9.53338L0.727111 4.41469C0.603685 4.27412 0.579459 4.07211 0.66615 3.90635H0.666145ZM2.58858 4.1211L5.22923 7.0459C5.39678 7.23137 5.68296 7.2459 5.86843 7.07835C5.87979 7.06809 5.89062 7.05726 5.90088 7.0459L8.54145 4.1211H8.54145C8.70553 3.93255 8.68569 3.64669 8.49714 3.48261C8.31344 3.32276 8.03618 3.33692 7.86972 3.51467L5.56497 6.06743L3.26015 3.51467C3.09282 3.32922 2.80685 3.31453 2.62141 3.48186C2.62132 3.48194 2.62123 3.48202 2.62114 3.4821C2.43569 3.64954 2.4211 3.93562 2.58854 4.12107C2.58855 4.12108 2.58856 4.12109 2.58857 4.1211H2.58858Z"
              fill={`url(#grad-${message?.ID})`}
            />
          </svg>
          }
      </div>
    } 
    return <></>;
  }