import React from 'react';
import { Conversation } from 'tim-js-sdk';
import './styles/index.scss';

export interface ConversationListContainerProps {
  error?: Error | null,
  loading?: boolean,
  setConversationList?: React.Dispatch<React.SetStateAction<Array<Conversation>>>
}

export function ConversationListContainer<
  T extends ConversationListContainerProps
  >(props: React.PropsWithChildren<T>) {
  const { children } = props;
  return (
    <div className="conversation-list-container">
      {children}
    </div>
  );
}
