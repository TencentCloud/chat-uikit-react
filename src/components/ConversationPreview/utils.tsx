import {
  format, isToday, isYesterday, formatDistance, isThisYear, isThisWeek,
} from 'date-fns';
import React from 'react';
import TIM, { Conversation, Group, Profile } from 'tim-js-sdk';
import { defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';

export const getDisplayTitle = (
  conversation: Conversation,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  const {
    name, nick, groupID, userID,
  } = getMessageProfile(conversation);
  const { type } = conversation;
  let title = '';
  switch (type) {
    case TIM.TYPES.CONV_C2C:
      title = nick || userID;
      break;
    case TIM.TYPES.CONV_GROUP:
      title = name || groupID;
      break;
    default:
      title = '';
  }
  const handleTitle = (str:string) => {
    const tempStr = str.toLocaleLowerCase();
    const pos = tempStr.indexOf(searchValue.toLocaleLowerCase());
    return (
      <div>
        <span>{str.slice(0, pos)}</span>
        <span style={{ color: highlightColor }}>{str.slice(pos, pos + searchValue.length)}</span>
        <span>{str.slice(pos + searchValue.length)}</span>
      </div>
    );
  };
  return !searchValue ? title : handleTitle(title);
};
export const getDisplayImage = (conversation: Conversation) => {
  const { type } = conversation;
  const { avatar } = getMessageProfile(conversation);
  let displayImage = avatar;
  if (!avatar) {
    switch (type) {
      case TIM.TYPES.CONV_C2C:
        displayImage = defaultUserAvatar;
        break;
      case TIM.TYPES.CONV_GROUP:
        displayImage = defaultGroupAvatarWork;
        break;
      default:
        displayImage = defaultGroupAvatarWork;
    }
  }
  return displayImage;
};
export const getDisplayMessage = (conversation:Conversation, myProfile:Profile) => {
  const { lastMessage, type } = conversation;
  const {
    fromAccount, nick, nameCard, isRevoked,
  } = lastMessage;
  let from = '';
  switch (type) {
    case TIM.TYPES.CONV_GROUP:
      from = lastMessage?.fromAccount === myProfile?.userID ? 'You: ' : `${nameCard || nick || fromAccount}: `;
      break;
    case TIM.TYPES.CONV_C2C:
      from = isRevoked ? 'you ' : '';
      break;
    default:
  }
  return (
    <div style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    >
      <span>{from}</span>
      <span>{lastMessage.isRevoked ? 'recalled a message' : lastMessage.messageForShow}</span>
    </div>
  );
};
interface TProfile extends Profile, Group {}
export const getMessageProfile = (conversation: Conversation):TProfile => {
  if (!conversation) return null;
  let result = {};
  const { type, groupProfile, userProfile } = conversation;
  switch (type) {
    case TIM.TYPES.CONV_C2C:
      result = userProfile;
      break;
    case TIM.TYPES.CONV_GROUP:
      result = groupProfile;
      break;
    case TIM.TYPES.CONV_SYSTEM:
    default:
  }
  return result as TProfile;
};
export const getDisplayTime = (conversation: Conversation) => {
  const { lastMessage } = conversation;
  return getTimeStamp(lastMessage.lastTime * 1000);
};
export const getTimeStamp = (time: number) => {
  if (!time) {
    return '';
  }
  if (!isThisYear(time)) {
    return format(time, 'yyyy MMM dd');
  }
  if (isToday(time)) {
    return format(time, 'p');
  }
  if (isYesterday(time)) {
    return formatDistance(time, new Date());
  }
  if (isThisWeek(time)) {
    return format(time, 'eeee');
  }
  return format(time, 'MMM dd');
};
