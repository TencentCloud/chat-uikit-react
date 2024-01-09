import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTUIKitContext, useTUIContactContext } from '../../context';
import useContactSearch from './hooks/useContactSearch';
import { Icon, IconTypes } from '../Icon';
import { Avatar, defaultUserAvatar } from '../Avatar';
import { Input } from '../Input';
import './index.scss';

export function UnMemoizedTUIContactSearch<T>(): React.ReactElement {
  const { chat, setActiveContact } = useTUIKitContext('TUIContactSearch');
  const { t } = useTranslation();
  const { friendList, setShowContactList } = useTUIContactContext('TUIContactList');
  const [isShowSearchResult, setShowSearchResult] = useState(false);
  const { checkFriend, isBlock, getUserProfile } = useContactSearch();
  const [searchedValue, setSearchedValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const searchValueChange = (e) => {
    if (e.target?.value === '') {
      setShowContactList(true);
      setShowSearchResult(false);
      setSearchResult([]);
      return;
    }
    setShowSearchResult(true);
    setSearchedValue(e.target?.value);
    setShowContactList(false);
  };

  const searchValueBlur = (e) => {
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
      const friendProfile = friendList.find((item) => item.userID === searchedValue);
      setActiveContact({ type: 'friend', data: friendProfile });
      return;
    }
    if (isBlock(profile.userID)) {
      setActiveContact({ type: 'block', data: profile });
      return;
    }
    // set 数据
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
        ) : searchResult.map((item, index) => {
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
export const TUIContactSearch = React.memo(UnMemoizedTUIContactSearch);
