import React, { PropsWithChildren, useMemo, useState } from 'react';
import { useUIKit } from '@tencentcloud/uikit-base-component-react';
import {
  TUIContactContextProvider,
  TUIContactContextValue,
} from '../../context/ContactContext';
import { isH5 } from '../../utils/env';
import { useUIManagerStore } from '../../store';
import useTUIContact from './hooks/useTUIContact';
import { ContactList } from './ContactList/ContactList';
import { ContactSearch } from '../ContactSearch/ContactSearch';
import { Icon, IconTypes } from '../Icon';
import './index.scss';

export function UnMemoizedContact<T>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const { children } = props;
  const { t } = useUIKit();
  const { setActiveContact } = useUIManagerStore('TUIContact');
  const [isShowAddFriend, setShowAddFriend] = useState(false);
  const addFriend = () => {
    setActiveContact();
    setShowAddFriend(true);
  };
  const addFriendBack = () => {
    setActiveContact();
    setShowAddFriend(false);
  };
  const {
    friendList,
    blockList,
    blocklistProfile,
    friendApplicationList,
    isShowContactList,
    setShowContactList,
  } = useTUIContact();

  const TUIContactValue: TUIContactContextValue = useMemo(
    () => ({
      friendList,
      blockList,
      blocklistProfile,
      friendApplicationList,
      isShowContactList,
      setShowContactList,
    }),
    [
      friendList,
      blocklistProfile,
      friendApplicationList,
      isShowContactList,
      setShowContactList,
    ],
  );
  return (
    <TUIContactContextProvider value={TUIContactValue}>
      {children || (
        <div className={`tui-contacts ${isH5 ? 'tui-contacts-h5' : ''} `}>
          {!isShowAddFriend && (
            <>
              <div className="tui-contacts-header">
                <div className="tui-contact-input">
                  <ContactSearch />
                </div>
                <Icon
                  onClick={addFriend}
                  type={IconTypes.ADDFRIEND}
                  width={24}
                  height={24}
                />
              </div>
              <ContactList />
            </>
          )}
          {isShowAddFriend && (
            <>
              <div className="tui-contacts-add-header">
                <Icon
                  onClick={addFriendBack}
                  type={IconTypes.BACK}
                  width={9}
                  height={16}
                />
                <div className="tui-contacts-add-header-title">
                  {t('TUIContact.Add Friend')}
                </div>
              </div>
              <ContactSearch />
            </>
          )}
        </div>
      )}
    </TUIContactContextProvider>
  );
}
export const Contact = React.memo(UnMemoizedContact);
