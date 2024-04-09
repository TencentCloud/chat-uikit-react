import React from 'react';
import { useTranslation } from 'react-i18next';
import TencentCloudChat, { Conversation, Group, Profile } from '@tencentcloud/chat';
import { defaultGroupAvatarWork, defaultUserAvatar } from '../Avatar';
import { formatEmojiString } from '../TUIMessage/utils/emojiMap';
import { getTimeStamp } from '../untils';

export const getDisplayTitle = (
  conversation: Conversation,
  searchValue?: string,
  highlightColor = '#147AFF',
): string | React.ReactElement => {
  const {
    name, nick, groupID, userID,
  } = getMessageProfile(conversation);
  const { type, remark } = conversation;
  let title = '';
  switch (type) {
    case TencentCloudChat.TYPES.CONV_C2C:
      title = remark || nick || userID;
      break;
    case TencentCloudChat.TYPES.CONV_GROUP:
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
      case TencentCloudChat.TYPES.CONV_C2C:
        displayImage = defaultUserAvatar;
        break;
      case TencentCloudChat.TYPES.CONV_GROUP:
        displayImage = defaultGroupAvatarWork;
        break;
      default:
        displayImage = defaultGroupAvatarWork;
    }
  }
  return displayImage;
};
export const getDisplayMessage = (
  conversation:Conversation,
  myProfile:Profile,
  language?:string,
) => {
  const { lastMessage, type } = conversation;
  const {
    fromAccount, nick, nameCard, isRevoked,
  } = lastMessage;
  let { messageForShow } = lastMessage;
  if (lastMessage.type === TencentCloudChat.TYPES.MSG_CUSTOM && lastMessage.payload?.description) {
    messageForShow = lastMessage.payload.description;
  }
  let from = '';
  switch (type) {
    case TencentCloudChat.TYPES.CONV_GROUP:
      from = lastMessage?.fromAccount === myProfile?.userID ? 'You' : `${nameCard || nick || fromAccount || ''}`;
      from = `${from ? `${from}:` : ''}`;
      break;
    case TencentCloudChat.TYPES.CONV_C2C:
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
      <span>{lastMessage.isRevoked ? 'recalled a message' : formatEmojiString(messageForShow, 1)}</span>
    </div>
  );
};
interface TProfile extends Profile, Group {}
export const getMessageProfile = (conversation: Conversation):TProfile => {
  if (!conversation) return null;
  let result = {};
  const { type, groupProfile, userProfile } = conversation;
  switch (type) {
    case TencentCloudChat.TYPES.CONV_C2C:
      result = userProfile;
      break;
    case TencentCloudChat.TYPES.CONV_GROUP:
      result = groupProfile;
      break;
    case TencentCloudChat.TYPES.CONV_SYSTEM:
    default:
  }
  return result as TProfile;
};
export const getDisplayTime = (conversation: Conversation, language?: string) => {
  const { lastMessage } = conversation;
  return getTimeStamp(lastMessage.lastTime * 1000, language);
};
