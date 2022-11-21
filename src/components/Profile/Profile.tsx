import React from 'react';
import './styles/index.scss';
import { Profile as TProfile } from 'tim-js-sdk';
import { Avatar, defaultUserAvatar } from '../Avatar';
import { Icon, IconTypes } from '../Icon';

export interface ProfileProps {
  profile?: TProfile,
  className?: string,
  handleAvatar?: () => void,
}
export function Profile<T extends ProfileProps>(props: T) {
  const { profile, className = '', handleAvatar } = props;
  return (profile?.nick || profile?.userID) && (
    <div className={`profile ${className}`}>
      <div className="profile-content">
        <Avatar size={32} image={profile.avatar || defaultUserAvatar} onClick={handleAvatar} />
        <div className="profile-name">{profile.nick || profile.userID}</div>
      </div>
      <div className="profile-more">
        <Icon type={IconTypes.ELLIPSE} width={18} height={5} onClick={handleAvatar} />
      </div>
    </div>
  );
}
