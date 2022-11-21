import React, { useState, useEffect } from 'react';
import { Conversation } from 'tim-js-sdk';
import { TUIKitContextValue, useTUIKitContext } from '../../context';
import { ConversationPreviewContent } from './ConversationPreviewContent';
import { AvatarProps } from '../Avatar';

import {
  getDisplayImage, getDisplayMessage, getDisplayTitle, getDisplayTime,
} from './utils';

export interface ConversationPreviewUIComponentProps extends ConversationPreviewProps{
  /** If the component's Conversation is the active (selected) Conversation */
  active?: boolean,
  /** Image of Conversation to display */
  displayImage?: string,
  /** Title of Conversation to display */
  displayTitle?: string | React.ReactElement,
  /** Message of Conversation to display */
  displayMessage?: string | React.ReactElement,
  /** Time of Conversation to display */
  displayTime?: string,
  /** Number of unread Messages */
  unread?: number,
}
export interface ConversationPreviewProps {
  conversation: Conversation,
  activeConversation?: Conversation,
  Preview?: React.ComponentType<ConversationPreviewUIComponentProps>,
  Avatar?: React.ComponentType<AvatarProps>
  setActiveConversation?: TUIKitContextValue['setActiveConversation'],
  searchValue?: string,
  conversationUpdateCount?: number
}
export function ConversationPreview<T extends ConversationPreviewProps>(
  props: T,
):React.ReactElement {
  const {
    activeConversation,
    conversation,
    Preview = ConversationPreviewContent,
    searchValue,
    conversationUpdateCount,
  } = props;
  const {
    setActiveConversation,
    myProfile,
  } = useTUIKitContext('ConversationPreview');
  const [displayImage, setDisplayImage] = useState(getDisplayImage(conversation));
  const [displayTitle, setDisplayTitle] = useState(getDisplayTitle(conversation, searchValue));
  const [displayMessage, setDisplayMessage] = useState(getDisplayMessage(conversation, myProfile));
  const [displayTime, setDisplayTime] = useState(getDisplayTime(conversation));
  const [unread, setUnread] = useState(conversation.unreadCount);
  const isActive = activeConversation?.conversationID === conversation?.conversationID;
  if (!Preview) return null;
  useEffect(() => {
    setDisplayTitle(getDisplayTitle(conversation, searchValue));
    setDisplayMessage(getDisplayMessage(conversation, myProfile));
    setDisplayImage(getDisplayImage(conversation));
    setDisplayTime(getDisplayTime(conversation));
    setUnread(conversation.unreadCount);
  }, [conversation, searchValue, conversationUpdateCount]);

  return (
    <Preview
      {...props}
      active={isActive}
      displayImage={displayImage}
      displayTitle={displayTitle}
      displayMessage={displayMessage}
      displayTime={displayTime}
      unread={unread}
      setActiveConversation={setActiveConversation}
    />
  );
}
