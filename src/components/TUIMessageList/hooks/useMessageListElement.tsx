import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { Message } from 'tim-js-sdk';
import { TUIMessageProps } from '../../TUIMessage/TUIMessage';

interface MessageListElementProps {
  enrichedMessageList: Array<Message>;
  TUIMessage?: React.ComponentType<TUIMessageProps>,
}

function useMessageListElement <T extends MessageListElementProps>(
  props: PropsWithChildren<T>,
) {
  const { enrichedMessageList, TUIMessage } = props;
  return useMemo(() => enrichedMessageList?.map((item: Message, index:number) => {
    const key = `${JSON.stringify(item)}${index}`;
    return (
      <li className="message-list-item" key={key}>
        <TUIMessage message={item} />
      </li>
    );
  }), [enrichedMessageList]);
}

export default useMessageListElement;
