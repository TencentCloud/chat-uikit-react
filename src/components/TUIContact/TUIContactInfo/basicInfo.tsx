import React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from '@tencentcloud/chat';
import { Avatar, defaultUserAvatar } from '../../Avatar';

interface Props {
  profile: Profile;
}
export function UnMemoizedBasicInfo<T extends Props>(
  props: T,
): React.ReactElement {
  const { profile } = props;
  const { t } = useTranslation();
  const {
    userID, nick, selfSignature, avatar,
  } = profile;
  return (
    <div className="tui-contact-info-header">
      <div className="header-container">
        <div className="header-container-avatar">
          <Avatar size={60} image={avatar || defaultUserAvatar} />
          <div className="header-container-name">{nick || userID}</div>
        </div>
        <div className="header-container-text">{`ID:${userID}`}</div>
        <div className="header-container-text">
          {t('TUIContact.Signature')}
          :
          {selfSignature || ''}
        </div>
      </div>
    </div>
  );
}
export const BasicInfo = React.memo(UnMemoizedBasicInfo);
