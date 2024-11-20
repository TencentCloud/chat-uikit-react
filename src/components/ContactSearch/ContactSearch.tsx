import React, { useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import { useTUIContactContext } from '../../context';
import { useUIManagerStore } from '../../store';
import useContactSearch from './hooks/useContactSearch';
import { Icon, IconTypes } from '../Icon';
import { Avatar, defaultUserAvatar } from '../Avatar';
import { Input } from '../Input';
import './index.scss';

export function UnMemoizedContactSearch<T>(): React.ReactElement {
  const { setActiveContact } = useUIManagerStore('TUIContactSearch');
  const { t } = useUIKit();
  const { friendList, setShowContactList } = useTUIContactContext('TUIContactList');
  const [isShowSearchResult, setShowSearchResult] = useState(false);
  const { checkFriend, isBlock, getUserProfile } = useContactSearch();
  const [searchedValue, setSearchedValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const searchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.value === '') {
      setShowContactList && setShowContactList(true);
      setShowSearchResult(false);
      setSearchResult([]);
      return;
    }
    setShowSearchResult(true);
    setSearchedValue(e.target?.value);
    setShowContactList && setShowContactList(false);
  };

  const searchValueBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedValue(e.target?.value);
  };

  const onFocusSearch = () => {
    setActiveContact();
  };

  const getUserProfileHandler = async () => {
    if (searchedValue) {
      getUserProfile(searchedValue).then((res) => {
        const { data: userProfile } = res;
        setSearchResult(userProfile);
      });
    }
  };
  const setContactProfile = async (profile: any) => {
    const isFriend = await checkFriend(profile);
    if (isFriend) {
      const friendProfile = friendList?.find(item => item.userID === searchedValue);
      friendProfile && setActiveContact({ type: 'friend', data: friendProfile });
      return;
    }
    if (isBlock(profile.userID)) {
      setActiveContact({ type: 'block', data: profile });
      return;
    }
    setActiveContact({ type: 'addFriend', data: profile });
  };
  return (
    <div className="tui-contact-search">
      <Input
        className="tui-contact-search-input"
        placeholder={t('TUIContact.Enter a userID')}
        clearable
        value={searchedValue}
        onBlur={searchValueBlur}
        onFocus={onFocusSearch}
        onChange={searchValueChange}
        onKeyDown={getUserProfileHandler}
        prefix={<Icon type={IconTypes.SEARCH} height={16} width={16} />}
      />
      {isShowSearchResult && searchResult.length === 0
        ? (
            <div className="tui-contact-search-item">
              {t('TUIContact.No Result')}

            </div>
          )
        : searchResult.map((item, index) => {
          const { userID, avatar, nick } = item;
          return (
            <div
              className="tui-contact-search-item"
              role="button"
              tabIndex={0}
              key={userID}
              onClick={() => {
                setContactProfile(item);
              }}
            >
              <Avatar size={30} image={avatar || defaultUserAvatar} />
              <div className="search-item-name">{nick || userID}</div>
            </div>
          );
        })}
    </div>
  );
}
export const ContactSearch = React.memo(UnMemoizedContactSearch);
