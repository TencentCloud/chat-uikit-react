import React, { PropsWithChildren } from 'react';
import { MyProfile } from './myProfile/index';

import './styles/index.scss';
import { useMyProfile } from './hooks';
import { TUIProfileDefault } from './ProfileDefault';
import { useUIManagerStore } from '../../store';

interface TUIProfileProps {
  className?: string;
  TUIProfile?: React.ComponentType<any>;
}

function UnMemoizedProfile<T extends TUIProfileProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    className,
    TUIProfile: PropTUIProfile,
  } = props;

  const { myProfile, updateMyProfile } = useMyProfile();

  const { setTUIProfileShow, TUIProfileShow } = useUIManagerStore('TUIProfile');

  const TUIProfileUIComponent = PropTUIProfile || TUIProfileDefault;

  return (
    <>
      {/* //eslint-disable-next-line
    @ts-ignore */}
      <MyProfile
        profile={myProfile}
        handleAvatar={() => {
          setTUIProfileShow && setTUIProfileShow(true);
        }}
      />
      {TUIProfileShow && (
        <TUIProfileUIComponent
          className={className}
          userInfo={myProfile}
          update={updateMyProfile}
        />
      )}
    </>
  );
}

export const Profile = React.memo(UnMemoizedProfile) as
typeof UnMemoizedProfile;
