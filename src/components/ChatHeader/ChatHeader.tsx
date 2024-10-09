import React, { PropsWithChildren } from 'react';
import { Conversation } from '@tencentcloud/chat';
import { useTUIChatStateContext } from '../../context/ChatStateContext';
import type { TUIChatHeaderDefaultProps } from './ChatHeaderDefault';
import { ChatHeaderDefault } from './ChatHeaderDefault';

import './styles/index.scss';
import { useComponentContext } from '../../context';

interface TUIChatHeaderProps {
  title?: string;
  TUIChatHeader?: React.ComponentType<TUIChatHeaderDefaultProps>;
  conversation?: Conversation;
  avatar?: React.ReactElement | string;
  headerOpateIcon?: React.ReactElement | string;
  enableCall?: boolean;
}

function UnMemoizedTUIChatHeader<T extends TUIChatHeaderProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    title,
    conversation: propsConversation,
    TUIChatHeader: propTUIChatHeader,
    avatar,
    headerOpateIcon,
    enableCall,
  } = props;

  const { conversation: contextConversation } = useTUIChatStateContext('TUIChatHeader');
  const { TUIChatHeader: ContextTUIChatHeader } = useComponentContext('TUIChatHeader');

  const TUIChatHeaderUIComponent = propTUIChatHeader
    || ContextTUIChatHeader || ChatHeaderDefault;
  const conversation = propsConversation || contextConversation;

  return (
    <TUIChatHeaderUIComponent
      title={title}
      conversation={conversation}
      avatar={avatar}
      opateIcon={headerOpateIcon}
      enableCall={enableCall}
    />
  );
}

export const ChatHeader = React.memo(UnMemoizedTUIChatHeader) as
typeof UnMemoizedTUIChatHeader;
