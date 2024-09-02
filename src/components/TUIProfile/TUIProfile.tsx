import React, { PropsWithChildren } from 'react';
import { Profile } from '../Profile';

import './styles/index.scss';
import { useMyProfile } from './hooks';
import { TUIProfileDefault } from './TUIProfileDefault';
import { useUIManager } from '../../context';

interface TUIProfileProps {
  className?: string,
  TUIProfile?: React.ComponentType<any>,
}

function UnMemoizedTUIProfile<T extends TUIProfileProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    className,
    TUIProfile: PropTUIProfile,
  } = props;

  const { myProfile, updateMyProfile } = useMyProfile();

  const { setTUIProfileShow, TUIProfileShow } = useUIManager('TUIProfile');

  const TUIProfileUIComponent = PropTUIProfile || TUIProfileDefault;

  return (
    <>
    {/* //eslint-disable-next-line
    @ts-ignore */}
      <Profile
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

export const TUIProfile = React.memo(UnMemoizedTUIProfile) as
typeof UnMemoizedTUIProfile;
