import React, { useState, useEffect } from 'react';
import { Profile } from '@tencentcloud/chat';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { BasicInfo } from './basicInfo';
import { Switch } from '../../Switch';
import { useUIManagerStore } from '../../../store';
import useContactInfo from './hooks/useContactInfo';

interface Props {
  profile: Profile;
}
export function UnMemoizedBlockInfo<T extends Props>(
  props: T,
): React.ReactElement {
  const { profile } = props;
  const { contactData, setActiveContact } = useUIManagerStore('TUIContact');
  const { t } = useUIKit();
  const [isAddToBlocklist, setIsAddToBlocklist] = useState(false);

  const {
    removeFromBlocklist,
  } = useContactInfo();

  useEffect(() => {
    setIsAddToBlocklist(true);
  }, [contactData]);

  const removeFromBlocklistHandler = async () => {
    await removeFromBlocklist(profile.userID);
    setIsAddToBlocklist(false);
    setActiveContact();
  };
  return (
    <>
      <BasicInfo profile={profile} />
      <div className="tui-contact-info-content">
        <div className="content-item">
          <p className="content-item-label">{t('TUIContact.block')}</p>
          <Switch className="content-item-text" onChange={removeFromBlocklistHandler} checked={isAddToBlocklist} />
        </div>
      </div>
    </>
  );
}
export const BlockInfo = React.memo(UnMemoizedBlockInfo);
