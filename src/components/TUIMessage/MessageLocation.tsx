import React, { PropsWithChildren } from 'react';
import type { MessageContextProps } from './MessageText';

function MessageLocationWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;

  return (
    <a className="bubble message-location" href={context.href} target="_blank" title="点击查看详情" rel="noreferrer">
      <span>{context.description}</span>
      <img src={context.url} alt="" />
      {children}
    </a>
  );
}

const MemoizedMessageLocation = React.memo(MessageLocationWithContext) as
typeof MessageLocationWithContext;

export function MessageLocation(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageLocation {...props} />
  );
}
