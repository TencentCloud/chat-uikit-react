import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Friend } from '@tencentcloud/chat';
import { TUIConversationService } from '@tencentcloud/chat-uikit-engine';
import { useTUIKitContext } from '../../../context';
import { BasicInfo } from './basicInfo';
import { Switch } from '../../Switch';
import useContactInfo from './hooks/useContactInfo';
import { DivWithEdit } from '../../DivWithEdit';
import { useConversation } from '../../../hooks';
import '../index.scss';

interface Props {
  friend: Friend;
  openChat?: () => void,
}
export function UnMemoizedFriendInfo<T extends Props>(
  props: T,
): React.ReactElement {
  const {
    chat, contactData, setActiveContact, setActiveConversation,
  } = useTUIKitContext('TUIContact');
  const { t } = useTranslation();
  const { friend, openChat } = props;
  const { userID, profile, remark } = friend;
  const [isEditName, setIsEditRemark] = useState('');
  const [remarkValue, setRemarkValue] = useState('');
  const [isAddToBlocklist, setIsAddToBlocklist] = useState(false);
  const {
    addToBlocklist,
    deleteFriend,
  } = useContactInfo();
  const { createConversation } = useConversation(chat);
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
    // 清空右侧 container 内容
    setActiveContact();
  };

  const deleteFriendHandler = async () => {
    await deleteFriend(userID);
    setActiveContact();
  };
  const openC2CConversation = async () => {
    const conversationID = `C2C${userID}`;
    const conversation = await createConversation(conversationID);
    TUIConversationService.switchConversation(conversationID);
    setActiveConversation(conversation);
    openChat();
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
