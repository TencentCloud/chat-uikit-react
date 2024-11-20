import React from 'react';
import TencentCloudChat, { FriendApplication } from '@tencentcloud/chat';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { useUIManagerStore } from '../../../store';
import { Avatar, defaultUserAvatar } from '../../Avatar';
import useContactInfo from './hooks/useContactInfo';

interface Props {
  application: FriendApplication;
}
export function UnMemoizedFriendApplication<T extends Props>(
  props: T,
): React.ReactElement {
  const { setActiveContact } = useUIManagerStore('TUIContact');
  const { t } = useUIKit();
  const { application } = props;
  const {
    userID,
    nick,
    avatar,
    type,
    wording,
  } = application;
  const {
    acceptFriendApplication,
    refuseFriendApplication,
  } = useContactInfo();
  const acceptFriendApplicationHandler = () => {
    setActiveContact();
    acceptFriendApplication(userID);
  };

  const refuseFriendApplicationHandler = () => {
    setActiveContact();
    refuseFriendApplication(userID);
  };

  return (
    <>
      <div className="tui-contact-info-header">
        <div className="header-container">
          <div className="header-container-avatar">
            <Avatar size={60} image={avatar || defaultUserAvatar} />
            <div className="header-container-name">{nick || userID}</div>
          </div>
          <div className="header-container-text">{`ID:${userID}`}</div>
        </div>
      </div>
      <div className="tui-contact-info-content">
        <div className="content-item">
          <p className="content-item-label">{t('TUIContact.verification info')}</p>
          <p className="content-item-text">{wording}</p>
        </div>
      </div>
      {type === TencentCloudChat.TYPES.SNS_APPLICATION_SENT_TO_ME && (
        <div className="tui-contact-info-content">
          <div className="content-btn-container">
            <div className="content-item-btn delete-btn" role="button" tabIndex={0} onClick={refuseFriendApplicationHandler}>{t('TUIContact.Refuse')}</div>
            <div className="content-item-btn confirm-btn" role="button" tabIndex={0} onClick={acceptFriendApplicationHandler}>{t('TUIContact.Agree')}</div>
          </div>
        </div>
      )}
    </>
  );
}
export const FriendApplicationInfo = React.memo(UnMemoizedFriendApplication);
