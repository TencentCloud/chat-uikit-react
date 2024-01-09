import React, { PropsWithChildren, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TUIContactContextProvider,
  TUIContactContextValue,
} from '../../context/TUIContactContext';
import { useTUIKitContext } from '../../context';
import useTUIContact from './hooks/useTUIContact';
import { TUIContactList } from './TUIContactList/TUIContactList';
import { TUIContactSearch } from '../TUIContactSearch/TUIContactSearch';
import { Icon, IconTypes } from '../Icon';
import './index.scss';

export function UnMemoizedTUIContact<T>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const { children } = props;
  const { t } = useTranslation();
  const { setActiveContact } = useTUIKitContext('TUIContact');
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
        <div className="tui-contacts">
            {!isShowAddFriend && (
              <>
                <div className="tui-contacts-header">
                  <div className="tui-contact-input">
                    <TUIContactSearch />
                  </div>
                  <Icon
                    onClick={addFriend}
                    type={IconTypes.ADDFRIEND}
                    width={24}
                    height={24}
                  />
                </div>
                <TUIContactList />
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
                <TUIContactSearch />
              </>
            )}
        </div>
      )}
    </TUIContactContextProvider>
  );
}
export const TUIContact = React.memo(UnMemoizedTUIContact);
