import React, { PropsWithChildren, useMemo } from 'react';
import { TUIConversationProvider, TUIConversationContextValue } from '../../context/TUIConversationContext';
import { TUIConversationList } from '../TUIConversationList';
import { TUIProfile } from '../TUIProfile';

interface TUIConversationProps {
  createConversation?:(conversationID:string) => Promise<any>,
  deleteConversation?:(conversationID:string) => Promise<any>,
}

export function UnMemoizedTUIConversation<T extends TUIConversationProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    children,
    createConversation,
    deleteConversation,
  } = props;
  const TUIConversationValue: TUIConversationContextValue = useMemo(
    () => ({
      createConversation,
      deleteConversation,
    }),
    [
      createConversation,
      deleteConversation,
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
