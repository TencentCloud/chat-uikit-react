import {
  format,
  formatDistance,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
} from 'date-fns';
import TencentCloudChat from '@tencentcloud/chat';
import { defaultGroupAvatarWork, defaultUserAvatar } from './Avatar';

// Determine if it is a JSON string
export function isJSON(str: string) {
  if (typeof str === 'string') {
    try {
      const data = JSON.parse(str);
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}

// Determine if it is a JSON string
export function JSONStringToParse(str: string) {
  if (!isJSON(str)) {
    return str;
  }
  return JSON.parse(str);
}

export const handleDisplayAvatar = (avatar: string, type:string = TencentCloudChat.TYPES.CONV_C2C) => {
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
