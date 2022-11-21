import React, { useState, useEffect } from 'react';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { Avatar, defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';
import { Switch } from '../Switch';
import { useTUIKitContext } from '../../context';
import { getMessageProfile } from '../ConversationPreview/utils';
import { useConversationUpdate } from '../TUIConversationList/hooks/useConversationUpdate';
import { useConversation } from '../../hooks';

export function TUIManage() {
  const [conversation, setConversation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);
  const {
    conversation: activeConversation,
    setActiveConversation,
    tim,
    TUIManageShow,
    setTUIManageShow,
  } = useTUIKitContext('TUIManage');
  useConversationUpdate(null, () => {
    setForceUpdateCount((count) => count + 1);
  });
  const { pinConversation, deleteConversation } = useConversation(tim);
  const pinChatChange = (e) => {
    setIsPinned(e.target.checked);
    pinConversation({
      conversationID: conversation.conversationID,
      isPinned: e.target.checked,
    });
  };
  const handleDelete = () => {
    deleteConversation(conversation.conversationID);
    setActiveConversation(null);
  };
  const close = () => {
    setTUIManageShow(false);
  };
  useEffect(() => {
    setConversation(activeConversation);
    setProfile(getMessageProfile(activeConversation));
    setIsPinned(activeConversation ? activeConversation.isPinned : false);
  }, [activeConversation, forceUpdateCount]);

  return TUIManageShow && activeConversation && (
  <div className="tui-manage">
    <div className="tui-manage-title">
      <Icon type={IconTypes.CANCEL} width={16} height={16} onClick={close} />
      <span>Conversation Information</span>
    </div>
    <div className="tui-manage-container">
      <div className="tui-manage-info">
        <div className="info-avatar">
          <Avatar
            size={64}
            image={
              profile?.avatar || (profile?.groupID ? defaultGroupAvatarWork : defaultUserAvatar)
            }
          />
        </div>
        <div className="info-name">
          {profile?.nick || profile?.name}
        </div>
        <div className="info-id">
          ID:
          {profile?.userID || profile?.groupID}
        </div>
      </div>
      <div className="tui-manage-handle">
        <div className="manage-handle-box">
          <div className="manage-handle-title">Pin</div>
          <Switch
            onChange={pinChatChange}
            checked={isPinned}
          />
        </div>
        <div className="manage-handle-box" role="presentation" onClick={handleDelete}>
          <div className="manage-handle-title red">Delete</div>
        </div>
      </div>
    </div>
  </div>
  );
}
