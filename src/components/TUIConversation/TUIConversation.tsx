import React, { PropsWithChildren, useMemo } from 'react';
import { Conversation } from 'tim-js-sdk';
import { TUIConversationProvider, TUIConversationContextValue } from '../../context/TUIConversationContext';
import { TUIConversationList } from '../TUIConversationList';
import { TUIProfile } from '../TUIProfile';

interface TUIConversationProps {
  createConversation?:(conversationID:string) => Promise<any>,
  deleteConversation?:(conversationID:string) => Promise<any>,
  filterConversation?:(conversationList: Array<Conversation>) => Array<Conversation>,
}

export function UnMemoizedTUIConversation<T extends TUIConversationProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    children,
    createConversation,
    deleteConversation,
    filterConversation,
  } = props;
  const TUIConversationValue: TUIConversationContextValue = useMemo(
    () => ({
      createConversation,
      deleteConversation,
      filterConversation,
    }),
    [
      createConversation,
      deleteConversation,
      filterConversation,
    ],
  );

  return (
    <TUIConversationProvider value={TUIConversationValue}>
      {children || (
        <>
          <TUIConversationList />
          <TUIProfile />
        </>
      )}
    </TUIConversationProvider>
  );
}

export const TUIConversation = React.memo(
  UnMemoizedTUIConversation,
)as typeof UnMemoizedTUIConversation;
