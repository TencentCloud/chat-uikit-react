import React, { useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import TencentCloudChat from '@tencentcloud/chat';
import { isH5 } from '../../../utils/env';
import { useTUIContactContext } from '../../../context';
import { useUIManagerStore } from '../../../store';
import useContactInfo from '../ContactInfo/hooks/useContactInfo';
import useTUIContact from '../hooks/useTUIContact';
import { Avatar, defaultUserAvatar } from '../../Avatar';
import rightArrow from '../../Icon/images/right-arrow.svg';
import downArrow from '../../Icon/images/down-arrow.png';
import './index.scss';

interface RenderContactListProps {
  type: 'group' | 'block' | 'friend';
  isShow: boolean;
  title: string;
  list: any[] | undefined;
  setShow: (value: boolean) => void;
}

function UnMemoizedContactList<T>(): React.ReactElement {
  const { setActiveContact } = useUIManagerStore();
  const { t } = useUIKit();
  const {
    isShowContactList, friendList, blocklistProfile, friendApplicationList,
  } = useTUIContactContext('TUIContactList');
  const {
    acceptFriendApplication,
  } = useContactInfo();
  const { groupList } = useTUIContact();
  const [iShowFriendApplication, setShowFriendApplication] = useState(false);
  const [iShowFriends, setShowFriends] = useState(false);
  const [isShowBlocklist, setShowBlocklist] = useState(false);
  const [isShowGrouplist, setShowGrouplist] = useState(false);

  const acceptFriendApplicationHandle = (e: any, userID: string) => {
    e.stopPropagation();
    acceptFriendApplication(userID);
    setActiveContact();
  };

  const RenderContactList = ({ type, isShow, setShow, list, title }: RenderContactListProps) => {
    return (
      <>
        <div
          className="tui-contacts-title"
          role="button"
          tabIndex={0}
          onClick={() => setShow(!isShow)}
        >
          <div className="tui-contacts-list-title">{title}</div>
          <div className="tui-contacts-list-icon">
            {isShow
              ? <i className="iconfont contacts-list-icon">&#xe605;</i>
              : <i className="iconfont contacts-list-icon">&#xe606;</i>}
          </div>
        </div>
        {isShow
        && list?.map((item: any) => {
          const { userID, groupID, avatar, name, nick } = item.profile || item;
          const showName = item.remark || nick || userID || name || groupID;
          return (
            <div
              role="button"
              tabIndex={0}
              className="tui-contacts-list-item"
              key={userID || groupID}
              onClick={() => {
                setActiveContact({ type, data: item });
              }}
            >
              <Avatar size={30} image={avatar || defaultUserAvatar} />
              <div className="tui-contacts-list-item-container">
                <p className="tui-contacts-list-item-name">{ showName }</p>
              </div>
            </div>
          );
        })}
      </>
    );
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
            {iShowFriendApplication
              ? <i className="iconfont contacts-list-icon">&#xe605;</i>
              : <i className="iconfont contacts-list-icon">&#xe606;</i>}
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
        <RenderContactList
          type="block"
          title={t('TUIContact.Blocked List')}
          isShow={isShowBlocklist}
          setShow={setShowBlocklist}
          list={blocklistProfile}
        />
        <RenderContactList
          type="group"
          title={t('TUIContact.Group List')}
          setShow={setShowGrouplist}
          isShow={isShowGrouplist}
          list={groupList}
        />
        <RenderContactList
          type="friend"
          title={t('TUIContact.Friends')}
          setShow={setShowFriends}
          isShow={iShowFriends}
          list={friendList}
        />
      </div>
    )
  );
}
export const ContactList = React.memo(UnMemoizedContactList);
