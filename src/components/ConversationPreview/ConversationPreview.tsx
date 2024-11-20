// ConversationPreview.tsx
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import { IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Icon, IconTypes } from '../Icon';
import { Avatar as DefaultAvatar, type AvatarProps } from '../Avatar';
import { ConversationActions as DefaultConversationActions, type IConversationActionsConfig, type IConversationActionsProps } from '../ConversationActions';
import { useConversationList } from '../../context/ConversationListContext';
import { useUIManagerStore } from '../../store';
import useLongPress from '../../hooks/useLongPress';
import useMouseHover from '../../hooks/useMouseHover';
import { generateHighlightTitle, getLatestMessagePreview } from './utils';
import { getTimeStamp } from '../utils';
import { isH5 } from '../../utils/env';

import './ConversationPreview.scss';

interface IConversationPreviewUIProps {
  /** The conversation to be displayed */
  conversation: IConversationModel;
  /** If the component's Conversation is the active (selected) Conversation */
  isSelected?: boolean;
  /** Whether to show the ConversationActions */
  enableActions?: boolean;
  /** The string to be highlighted in the title */
  highlightMatchString?: string;
  /** The custom Avatar component */
  Avatar?: React.ComponentType<AvatarProps>;
  /** The custom Title component */
  Title?: string | JSX.Element;
  /** The custom last message abstract component */
  LastMessageAbstract?: string | JSX.Element;
  /** The custom last message abstract component */
  LastMessageTimestamp?: string | JSX.Element;
  /** The custom Unread component */
  Unread?: string | JSX.Element;
  /** The custom ConversationActions component */
  ConversationActions?: React.ComponentType<IConversationActionsProps>;
  /** Callback when the user click a conversation from conversation list */
  onSelectConversation?: (conversation: IConversationModel) => void;
  /** The custom ConversationActions config */
  actionsConfig?: IConversationActionsConfig;
  /** The custom class name */
  className?: string;
  /** The custom class style */
  style?: CSSProperties;
  /** The custom children node to override UI */
  children?: React.ReactNode;
}

interface IConversationPreviewProps extends IConversationPreviewUIProps {
  /** The custom Preview UI component */
  Preview?: React.ComponentType<IConversationPreviewUIProps>;
}

function ConversationPreviewTitle(props: {
  conversation: IConversationModel;
  highlightMatchString?: string;
}): string | JSX.Element {
  const { conversation, highlightMatchString } = props;
  return (
    <div className="uikit-conversation-preview__title text-ellipsis">
      {generateHighlightTitle(conversation, highlightMatchString).map((item, index) => (
        <span
          key={index}
          className={cs({
            'uikit-conversation-preview__title--highlight': item.isHighlight,
            'uikit-conversation-preview__title--normal': !item.isHighlight,
          })}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

function ConversationPreviewTimestamp(props: {
  conversation: IConversationModel;
}): string | JSX.Element {
  const { conversation } = props;
  const { language } = useUIKit();
  return (
    <div className="uikit-conversation-preview__time">
      {getTimeStamp(+(conversation.lastMessage?.lastTime || 0) * 1000, language)}
    </div>
  );
}

function ConversationPreviewAbstract(props: {
  conversation: IConversationModel;
}): string | JSX.Element {
  const { conversation } = props;
  const { myProfile } = useUIManagerStore();
  return (
    <div className="uikit-conversation-preview__abstract">
      {getLatestMessagePreview(conversation, myProfile)}
    </div>
  );
}

function ConversationPreviewUnread(props: {
  conversation: IConversationModel;
}): string | JSX.Element {
  const { conversation } = props;
  let content;
  if (conversation.isMuted) {
    content = <Icon type={IconTypes.MUTE} width={16} height={16} />;
  } else if (conversation.unreadCount > 99) {
    content = '99+';
  } else if (conversation.unreadCount === 0) {
    content = null;
  } else {
    content = conversation.unreadCount;
  }
  return (
    <div className="uikit-conversation-preview__unread">
      {content}
    </div>
  );
}

function ConversationPreview<T extends IConversationPreviewProps>(
  props: T,
): React.ReactElement {
  const {
    conversation,
    isSelected = false,
    enableActions = true,
    highlightMatchString,
    Preview = ConversationPreviewUI,
    Avatar = DefaultAvatar,
    ConversationActions = DefaultConversationActions,
    Title = ConversationPreviewTitle({ conversation, highlightMatchString }),
    LastMessageTimestamp = ConversationPreviewTimestamp({ conversation }),
    LastMessageAbstract = ConversationPreviewAbstract({ conversation }),
    Unread = ConversationPreviewUnread({ conversation }),
    onSelectConversation,
    actionsConfig,
    className,
    style,
    children,
  } = props;

  const { setCurrentConversation } = useConversationList();

  return (
    <Preview
      conversation={conversation}
      isSelected={isSelected}
      enableActions={enableActions}
      highlightMatchString={highlightMatchString}
      Avatar={Avatar}
      ConversationActions={ConversationActions}
      Title={Title}
      LastMessageTimestamp={LastMessageTimestamp}
      LastMessageAbstract={LastMessageAbstract}
      Unread={Unread}
      onSelectConversation={onSelectConversation}
      actionsConfig={actionsConfig}
      className={className}
      style={style}
      children={children}
    />
  );
}

function ConversationPreviewUI<T extends IConversationPreviewUIProps>(
  props: T,
): React.ReactElement {
  const {
    conversation,
    isSelected,
    enableActions,
    Avatar = DefaultAvatar,
    ConversationActions = DefaultConversationActions,
    Title,
    LastMessageTimestamp,
    LastMessageAbstract,
    Unread,
    onSelectConversation,
    actionsConfig,
    className,
    style,
    children,
  } = props;

  const {
    currentConversation,
    setCurrentConversation,
  } = useConversationList();

  const conversationPreviewRef = useRef<HTMLDivElement>(null);
  const [isActionMenuActive, setIsActionMenuActive] = useState(false);

  const isHovering = useMouseHover(conversationPreviewRef);
  const onLongPress = useLongPress({}, {
    delay: 500,
    shouldPreventDefault: true,
  });
  const { isLongPressing } = onLongPress;

  useEffect(() => {
    setIsActionMenuActive(isHovering || isLongPressing);
  }, [isHovering, isLongPressing]);

  const onClick = () => {
    onSelectConversation?.(conversation);
    setCurrentConversation(conversation);
  };

  return (
    <div
      ref={conversationPreviewRef}
      className={cs('uikit-conversation-preview', className, {
        'uikit-conversation-preview--mobile': isH5,
        'uikit-conversation-preview--active': isSelected || conversation.conversationID === currentConversation?.conversationID,
        'uikit-conversation-preview--unread': !conversation.isMuted && conversation.unreadCount > 0,
        'uikit-conversation-preview--pin': conversation.isPinned,
        'uikit-conversation-preview--mute': conversation.isMuted,
      })}
      style={style}
      onClick={onClick}
    >
      {children || (
        <>
          <div className="uikit-conversation-preview__avatar">
            <Avatar
              image={conversation.getAvatar()}
              size={40}
            />
          </div>
          <div className="uikit-conversation-preview__content">
            {Title}
            {LastMessageAbstract}
          </div>
          <div className="uikit-conversation-preview__external">
            {Unread}
            {(enableActions && isActionMenuActive)
              ? (
                  <ConversationActions
                    conversation={conversation}
                    {...actionsConfig}
                  />
                )
              : LastMessageTimestamp}
          </div>
        </>
      )}
    </div>
  );
}

export {
  ConversationPreview,
  ConversationPreviewUI,
  IConversationPreviewProps,
  IConversationPreviewUIProps,
};
