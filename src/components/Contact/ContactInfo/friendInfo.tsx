import React, { useState, useEffect } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { Friend } from '@tencentcloud/chat';
import { TUIConversationService, IConversationModel } from '@tencentcloud/chat-uikit-engine';
import { useUIManagerStore } from '../../../store';
import { BasicInfo } from './basicInfo';
import { Switch } from '../../Switch';
import useContactInfo from './hooks/useContactInfo';
import { DivWithEdit } from '../../DivWithEdit';
import '../index.scss';

interface Props {
  friend: Friend;
  showChats?: () => void;
}
export function UnMemoizedFriendInfo<T extends Props>(
  props: T,
): React.ReactElement {
  const { chat } = useUIManagerStore();
  const {
    contactData, setActiveContact, setActiveConversation,
  } = useUIManagerStore('TUIContact');
  const { t } = useUIKit();
  const { friend, showChats } = props;
  const { userID, profile, remark } = friend;
  const [isEditName, setIsEditRemark] = useState('');
  const [remarkValue, setRemarkValue] = useState('');
  const [isAddToBlocklist, setIsAddToBlocklist] = useState(false);
  const {
    addToBlocklist,
    deleteFriend,
  } = useContactInfo();
  useEffect(() => {
    setIsAddToBlocklist(false);
    setRemarkValue(remark);
  }, [contactData, remark]);

  const handleSetEditRemark = () => {
    setIsEditRemark('remark');
  };

  const editText = (data?: any) => {
    chat.updateFriend({
      userID,
      remark: data?.value,
    });
    setRemarkValue(data?.value);
    setIsEditRemark('');
  };

  const addToBlocklistHandler = async () => {
    await addToBlocklist(userID);
    setIsAddToBlocklist(true);
    setActiveContact();
  };

  const deleteFriendHandler = async () => {
    await deleteFriend(userID);
    setActiveContact();
  };
  const openC2CConversation = () => {
    const conversationID = `C2C${userID}`;
    showChats && showChats();
    TUIConversationService.switchConversation(conversationID).then(
      (conversationModel: IConversationModel) => {
        setActiveConversation(conversationModel.getConversation());
      },
    );
  };

  return (
    <>
      <BasicInfo profile={profile} />
      <div className="tui-contact-info-content">
        <div className="content-item">
          <p className="content-item-label">{t('TUIContact.remark')}</p>
          <DivWithEdit
            name="remark"
            className="content-item-text"
            value={remarkValue}
            type="text"
            toggle={handleSetEditRemark}
            isEdit={isEditName === 'remark'}
            confirm={editText}
            close={() => {
              setIsEditRemark('');
            }}
          />
        </div>
        <div className="content-item">
          <p className="content-item-label">{t('TUIContact.block')}</p>
          <Switch
            className="content-item-text"
            onChange={addToBlocklistHandler}
            checked={isAddToBlocklist}
          />
        </div>
        <div className="content-btn-container">
          <div className="content-item-btn delete-btn" role="button" tabIndex={0} onClick={deleteFriendHandler}>{t('TUIContact.Delete friend')}</div>
          <div className="content-item-btn confirm-btn" role="button" tabIndex={0} onClick={openC2CConversation}>{t('TUIContact.Send Message')}</div>
        </div>
      </div>
    </>
  );
}
export const FriendInfo = React.memo(UnMemoizedFriendInfo);
