import React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from '@tencentcloud/chat';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';
import { useUIManager } from '../../../context';
import { Icon, IconTypes } from '../../Icon';
import { isH5 } from '../../../utils/env';

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
  const { setActiveContact } = useUIManager('TUIContact');
  const back = () => {
    TUIConversationService.switchConversation('');
    setActiveContact();
  };
  return (
    <div className="tui-contact-info-header">
      {isH5 && (
      <Icon
        width={9}
        height={16}
        type={IconTypes.BACK}
        onClick={back}
      />
      )}
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
