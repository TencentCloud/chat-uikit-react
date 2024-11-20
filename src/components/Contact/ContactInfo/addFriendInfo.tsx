import React, { useState } from 'react';
import { Profile } from '@tencentcloud/chat';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import useContactInfo from './hooks/useContactInfo';
import { BasicInfo } from './basicInfo';
import { DivWithEdit } from '../../DivWithEdit';

interface Props {
  profile: Profile;
}
export function UnMemoizedAddFriendInfo<T extends Props>(
  props: T,
): React.ReactElement {
  const { profile } = props;
  const { userID } = profile;
  const { t } = useUIKit();
  const [isEditName, setIsEditRemark] = useState('');
  const [remark, setRemark] = useState('');
  const [wording, setWording] = useState('');
  const [isSendedAdd, setIsSendAddFriend] = useState(false);

  const {
    addFriend,
  } = useContactInfo();
  const handleSetEditRemark = () => {
    setIsEditRemark('remark');
  };

  const addFriendHandler = async () => {
    const options = {
      userID,
      remark,
      wording,
    };
    await addFriend(options);
    setIsSendAddFriend(true);
  };

  const editText = (data?: any) => {
    setRemark(data?.value);
    setIsEditRemark('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWording(e.target.value);
  };
  return (
    <>
      <BasicInfo profile={profile} />
      {!isSendedAdd
        ? (
            <div className="tui-contact-info-content">
              <div className="content-item-wording">
                <p className="content-item-label">{t('TUIContact.Enter the verification info')}</p>
                <textarea className="content-item-wording-text" value={wording} onChange={(e: any) => { handleChange(e); }} />
              </div>
              <div className="content-item">
                <p className="content-item-label">{t('TUIContact.remark')}</p>
                <DivWithEdit
                  name="remark"
                  className="content-item-text"
                  value={remark}
                  type="text"
                  toggle={handleSetEditRemark}
                  isEdit={isEditName === 'remark'}
                  confirm={editText}
                  close={() => {
                    setIsEditRemark('');
                  }}
                />
              </div>
              <div className="content-btn-container">
                <div className="content-item-btn confirm-btn" role="button" tabIndex={0} onClick={addFriendHandler}>{t('TUIContact.Send application')}</div>
              </div>
            </div>
          )
        : (
            <div className="tui-contact-info-content">
              <div className="content-item">
                <p className="content-item-label">{t('TUIContact.verification info')}</p>
                <p className="content-item-text">{wording}</p>
              </div>
            </div>
          )}
    </>
  );
}
export const AddFriendInfo = React.memo(UnMemoizedAddFriendInfo);
