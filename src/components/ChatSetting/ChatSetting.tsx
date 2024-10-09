import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Conversation } from '@tencentcloud/chat';
import { TUIStore } from '@tencentcloud/chat-uikit-engine';
import './styles/index.scss';
import { Icon, IconTypes } from '../Icon';
import { Avatar, defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';
import { Switch } from '../Switch';
import { useUIManager } from '../../context';
import { isH5, isPC } from '../../utils/env';
import { getMessageProfile } from '../ConversationPreview/utils';

function UnMemoizedChatSetting<T>(
): React.ReactElement {
  const { t } = useTranslation();
  const [conversation, setConversation] = useState<Conversation>();
  const [profile, setProfile] = useState<any>();
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);
  const {
    conversation: activeConversation,
    setActiveConversation,
    TUIManageShow,
    setTUIManageShow,
  } = useUIManager('TUIManage');

  const pinChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPinned(e.target.checked);
    if (conversation?.conversationID) {
      const conversationModel = TUIStore.getConversationModel(conversation?.conversationID);
      conversationModel && conversationModel.pinConversation();
    }
  };
  const handleDelete = () => {
    if (conversation?.conversationID) {
      const conversationModel = TUIStore.getConversationModel(conversation?.conversationID);
      conversationModel && conversationModel.deleteConversation();
    }
    setActiveConversation(undefined);
  };
  const close = () => {
    setTUIManageShow && setTUIManageShow(false);
  };
  useEffect(() => {
    setConversation(activeConversation);
    activeConversation && setProfile(getMessageProfile(activeConversation));
    setIsPinned(activeConversation ? activeConversation.isPinned : false);
  }, [activeConversation, forceUpdateCount]);
  // eslint-disable-next-line
  // @ts-ignore
  return (
    TUIManageShow
    && activeConversation && (
      <div className={`tui-manage ${isH5 ? 'tui-h5-manage' : ''}`}>
        <div className="tui-manage-title">
          {isPC && (
            <Icon
              onClick={close}
              type={IconTypes.CANCEL}
              width={9}
              height={16}
            />
          )}
          {isH5 && (
            <Icon onClick={close} type={IconTypes.BACK} width={9} height={16} />
          )}
          <span style={{ marginLeft: '10px' }}>
            {t('TUIConversation.Conversation Information')}
          </span>
        </div>
        <div className="tui-manage-container">
          <div className="tui-manage-info">
            <div className="info-avatar">
              <Avatar
                size={64}
                image={
                  profile?.avatar
                  || (profile?.groupID
                    ? defaultGroupAvatarWork
                    : defaultUserAvatar)
                }
              />
            </div>
            <div className="info-name">{profile?.nick || profile?.name}</div>
            <div className="info-id">
              ID:
              {profile?.userID || profile?.groupID}
            </div>
          </div>
          <div className="tui-manage-handle">
            <div className="manage-handle-box">
              <div className="manage-handle-title">
                {t('TUIConversation.Pin')}
              </div>
              <Switch onChange={(e: any) => { pinChatChange(e); }} checked={isPinned} />
            </div>
            {isPC && (
              <div
                className="manage-handle-box"
                role="presentation"
                onClick={handleDelete}
              >
                <div className="manage-handle-title red">
                  {t('TUIConversation.Delete')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export const ChatSetting = React.memo(UnMemoizedChatSetting) as unknown as
typeof UnMemoizedChatSetting;
