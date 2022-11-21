import React, { PropsWithChildren } from 'react';
import { JSONStringToParse } from '../untils';
import type { MessageContextProps } from './MessageText';

function MessageCustomWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  const handleContext = (data) => {
    if (data.data === 'Hyperlink') {
      const extension = JSONStringToParse(data?.extension);
      return extension?.item.map((item) => <a target="_blank" key={item.value} href={item.value} rel="noreferrer">{item.value}</a>);
    }
    if (data.data === 'group_create') {
      return `${message?.nick || message?.from} Create a group`;
    }
    return data.extension;
  };

  return (
    <div className={`bubble message-custom bubble-${message.flow}`}>
      {handleContext(context?.custom)}
      {children}
    </div>
  );
}

const MemoizedMessageCustom = React.memo(MessageCustomWithContext) as
typeof MessageCustomWithContext;

export function MessageCustom(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageCustom {...props} />
  );
}
