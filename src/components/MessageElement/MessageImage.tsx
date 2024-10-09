import React, { PropsWithChildren, useState } from 'react';
import TencentCloudChat from '@tencentcloud/chat';
import { isH5 } from '../../utils/env';
import { Model } from '../Model';
import type { MessageContextProps } from './MessageText';

function MessageImageWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  const [show, setShow] = useState(false);

  const bigImageInfo = message?.payload?.imageInfoArray?.filter((item: any) => item.type === 0);

  return (
    <div className="message-image">
      <div role="button" tabIndex={0} onClick={() => { setShow(true); }}>
        <img className={`img ${isH5 ? 'img-h5' : ''} bubble-${message?.flow} 
        ${message?.conversationType === TencentCloudChat.TYPES.CONV_GROUP ? 'group' : ''}`} 
        src={context?.url} alt="" />
      </div>
      {children}
      {
        show && (
        <Model onClick={() => { setShow(false); }}>
          <img className="big-image" src={bigImageInfo[0]?.url} alt="" />
        </Model>
        )
      }
    </div>
  );
}

const MemoizedMessageImage = React.memo(MessageImageWithContext) as
typeof MessageImageWithContext;

export function MessageImage(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageImage {...props} />
  );
}
