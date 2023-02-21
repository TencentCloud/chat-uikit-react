import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import '@tencentcloud/chat-uikit-react/dist/cjs/index.css';

import './style.scss'

interface  LabelWithTitleProps {
  title?: string,
}

export function LabelWithTitle<T extends LabelWithTitleProps>(props: PropsWithChildren<T>):React.ReactElement   {
  const { children, title } = props;
  const [style, setStyle] = useState({});
  const titleRef = useRef<any>(null);
  useEffect(()=>{
    if (titleRef.current) {
      const width = titleRef?.current.offsetWidth;
      const parentWith = titleRef?.current.parentElement.offsetWidth;
      setStyle({
        left: `${parentWith/2 - width/2}px`,
        display: 'none'
      })
    }
  },[titleRef])
  return <div className='lable-with-title'>
    <label className='title' ref={titleRef} style={style}>{title}</label>
    {children}
  </div>
}