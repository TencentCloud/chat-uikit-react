import React, { PropsWithChildren } from 'react';

import './styles/index.scss';
import { useMyProfile } from './hooks';
import { TUIProfileDefault } from './TUIProfileDefault';
import { useTUIKitContext } from '../../context';

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

  const { TUIProfileShow } = useTUIKitContext('TUIProfile');

  const TUIProfileUIComponent = PropTUIProfile || TUIProfileDefault;

  return TUIProfileShow && (
    <TUIProfileUIComponent
      className={className}
      userInfo={myProfile}
      update={updateMyProfile}
    />
  );
}

export const TUIProfile = React.memo(UnMemoizedTUIProfile) as
typeof UnMemoizedTUIProfile;
