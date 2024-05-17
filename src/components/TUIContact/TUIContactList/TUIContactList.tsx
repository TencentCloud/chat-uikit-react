import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TencentCloudChat from '@tencentcloud/chat';
import { isH5 } from '../../../utils/env';
import { useTUIKitContext, useTUIContactContext } from '../../../context';
import useContactInfo from '../TUIContactInfo/hooks/useContactInfo';

import { Avatar, defaultUserAvatar } from '../../Avatar';
import rightArrow from '../../Icon/images/right-arrow.svg';
import downArrow from '../../Icon/images/down-arrow.png';

import './index.scss';

function UnMemoizedTUIContactList<T>(): React.ReactElement {
  const { setActiveContact } = useTUIKitContext();
  const { t } = useTranslation();
  const {
    isShowContactList, friendList, blocklistProfile, friendApplicationList,
  } = useTUIContactContext('TUIContactList');
  const {
    acceptFriendApplication,
  } = useContactInfo();

  const [iShowFriendApplication, setShowFriendApplication] = useState(false);
  const [iShowFriends, setShowFriends] = useState(false);
  const [isShowBlocklist, setShowBlocklist] = useState(false);

  const acceptFriendApplicationHandle = (e: any, userID: string) => {
    e.stopPropagation();
    acceptFriendApplication(userID);
    setActiveContact();
  };
  // eslint-disable-next-line
  // @ts-ignore
  return (
    isShowContactList && (
      <div className={`tui-contacts-list ${isH5 ? 'tui-contacts-list-h5' : ''} `}>
        <div
          className="tui-contacts-title"
          role="button"
          tabIndex={0}
          onClick={() => setShowFriendApplication(!iShowFriendApplication)}
        >
          <p className="tui-contacts-list-title">{t('TUIContact.New Contacts')}</p>
          <div className="tui-contacts-list-icon">
            <img src={iShowFriendApplication ? downArrow : rightArrow} alt="" />
          </div>
        </div>
        {iShowFriendApplication
          && friendApplicationList?.map((item, index) => {
            const {
              userID, avatar, nick, wording, type,
            } = item;
            return (
              <div
                role="button"
                tabIndex={0}
                className="tui-contacts-list-item"
                key={userID}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveContact({
                    type: 'friendApplication',
                    data: item,
                  });
                }}
              >
                <Avatar size={30} image={avatar || defaultUserAvatar} />
                <div className="tui-contacts-list-item-card">
                  <div>
                    <p className="tui-contacts-list-item-name text-ellipsis">
                      {nick || userID}
                    </p>
                    {wording !== '' && (
                      <p className="tui-contacts-list-item-text text-ellipsis">
                        {wording}
                      </p>
                    )}
                  </div>
                  {type === TencentCloudChat.TYPES.SNS_APPLICATION_SENT_BY_ME && (
                  <p className="tui-contacts-list-btn-text text-ellipsis">{t('TUIContact.waiting for verification')}</p>
                  )}
                  {type === TencentCloudChat.TYPES.SNS_APPLICATION_SENT_TO_ME && (
                    <div
                      className="application-btn"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        acceptFriendApplicationHandle(e, userID);
                      }}
                    >
                      {t('TUIContact.Agree')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        <div
          className="tui-contacts-title"
          role="button"
          tabIndex={0}
          onClick={() => setShowBlocklist(!isShowBlocklist)}
        >
          <div className="tui-contacts-list-title">{t('TUIContact.Blocked List')}</div>
          <div className="tui-contacts-list-icon">
            <img src={isShowBlocklist ? downArrow : rightArrow} alt="" />
          </div>
        </div>
        {isShowBlocklist
          && blocklistProfile?.map((item, index) => {
            const { userID, avatar, nick } = item;
            return (
              <div
                role="button"
                tabIndex={0}
                className="tui-contacts-list-item"
                key={userID}
                onClick={() => {
                  setActiveContact({ type: 'block', data: item });
                }}
              >
                <Avatar size={30} image={avatar || defaultUserAvatar} />
                <div className="tui-contacts-list-item-container">
                  <p className="tui-contacts-list-item-name">{ nick || userID}</p>
                </div>
              </div>
            );
          })}
        <div
          className="tui-contacts-title"
          role="button"
          tabIndex={0}
          onClick={() => setShowFriends(!iShowFriends)}
        >
          <div className="tui-contacts-list-title">{t('TUIContact.Friends')}</div>
          <div className="tui-contacts-list-icon">
            <img src={iShowFriends ? downArrow : rightArrow} alt="" />
          </div>
        </div>
        {iShowFriends
          && friendList?.map((item, index) => {
            const { userID, avatar, nick } = item.profile;
            return (
              <div
                className="tui-contacts-list-item"
                key={userID}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveContact({ type: 'friend', data: item });
                }}
              >
                <Avatar size={30} image={avatar || defaultUserAvatar} />
                <div className="tui-contacts-list-item-container">
                  <p className="tui-contacts-list-item-name">{item.remark || nick || userID}</p>
                </div>
              </div>
            );
          })}
      </div>
    )
  );
}
export const TUIContactList = React.memo(UnMemoizedTUIContactList);
