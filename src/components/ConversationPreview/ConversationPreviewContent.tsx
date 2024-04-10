import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';
import { isPC } from '../../utils/env';
import { ConversationPreviewUIComponentProps } from './ConversationPreview';

import { Avatar as DefaultAvatar } from '../Avatar/index';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { Plugins } from '../Plugins';
import { useConversation } from '../../hooks';
import { useTUIKitContext } from '../../context';

export function unMemoConversationPreviewContent<T extends ConversationPreviewUIComponentProps>(
  props: T,
):React.ReactElement {
  const {
    conversation,
    Avatar = DefaultAvatar,
    displayImage,
    displayTitle,
    displayMessage,
    displayTime,
    unread,
    active,
    activeConversationID,
    setActiveConversationID,
    setActiveConversation,
  } = props;

  const { t } = useTranslation();
  const conversationPreviewButton = useRef<HTMLButtonElement | null>(null);
  const { chat, conversation: activeConversation } = useTUIKitContext('ConversationPreviewContent');
  const { pinConversation, deleteConversation } = useConversation(chat);
  const activeClass = active ? 'conversation-preview-content--active' : '';
  const unreadClass = unread && unread >= 1 ? 'conversation-preview-content--unread' : '';
  const pinClass = conversation.isPinned ? 'conversation-preview-content--pin' : '';
  const [isHover, setIsHover] = useState(false);
  const pluginsRef = useRef(null);

  const onSelectConversation = () => {
    TUIConversationService.switchConversation(conversation?.conversationID);
    if (setActiveConversation) {
      setActiveConversation(conversation);
    }
    if (conversationPreviewButton?.current) {
      conversationPreviewButton.current.blur();
    }
  };
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  useEffect(() => {
    if (activeConversationID !== conversation.conversationID) {
      setIsHover(false);
    }
  }, [activeConversationID]);
  // h5 long press
  let timer: any;
  const handleH5LongPress = (type: string) => {
    if (isPC) return;
    const { conversationID } = conversation;
    setActiveConversationID(conversationID);
    function longPressHandler() {
      clearTimeout(timer);
      setIsHover(true);
    }
    function touchStartHandler() {
      timer = setTimeout(longPressHandler, 500);
    }
    function touchEndHandler() {
      clearTimeout(timer);
    }
    switch (type) {
      case 'touchstart':
        touchStartHandler();
        break;
      case 'touchend':
        touchEndHandler();
        setTimeout(() => {
          // setIsHover(false);
        }, 200);
        break;
      default:
    }
  };

  const moreHandle = (e: any, type: string) => {
    const { conversationID, isPinned } = conversation;
    e.stopPropagation();
    setIsHover(false);
    pluginsRef.current.closeMore();
    switch (type) {
      case 'pin':
        pinConversation({ conversationID, isPinned: !isPinned });
        break;
      case 'delete':
        deleteConversation(conversationID);
        if (conversation === activeConversation) {
          setActiveConversation(null);
        }
        break;
      default:
    }
  };

  return (
    <button
      type="button"
      aria-selected={active}
      role="option"
      className={`conversation-preview-container ${activeClass} ${unreadClass} ${pinClass}`}
      onClick={onSelectConversation}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => handleH5LongPress('touchstart')}
      onTouchEnd={() => handleH5LongPress('touchend')}
      ref={conversationPreviewButton}
    >
      <div className="avatar">
        <Avatar image={displayImage} name={displayTitle} size={40} />
      </div>
      <div className="content">
        <div className="title text-ellipsis">
          {displayTitle}
        </div>
        <div className="message">
          {displayMessage}
        </div>
      </div>
      <div className="external">
        {unread ? (<div className="unread">{unread <= 99 ? unread : '99+'}</div>) : (<div className="unread" />)}
        {!isHover
          ? (
            <div className="time">
              {displayTime}
            </div>
          )
          : (
            <div className={`${isHover ? 'more--hover' : 'more'}`}>
              <Plugins
                customClass="more-handle-box"
                ref={pluginsRef}
                plugins={[
                  <div
                    role="presentation"
                    className="more-handle-item"
                    onClick={(e) => {
                      moreHandle(e, 'pin');
                    }}
                  >
                    {t(!conversation.isPinned ? 'TUIConversation.Pin' : 'TUIConversation.Unpin')}
                  </div>,
                  <div
                    className="more-handle-item"
                    style={{ color: '#FF584C' }}
                    onClick={(e) => {
                      moreHandle(e, 'delete');
                    }}
                    role="presentation"
                  >
                    {t('TUIConversation.Delete')}
                  </div>,
                ]}
                showNumber={0}
                MoreIcon={(
                  <Icon
                    className="icon-more"
                    width={16}
                    height={16}
                    type={IconTypes.MORE}
                  />
              )}
              />
            </div>
          )}
      </div>
    </button>
  );
}

export const ConversationPreviewContent = React.memo(unMemoConversationPreviewContent) as
  typeof unMemoConversationPreviewContent;
