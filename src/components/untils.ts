import {
  format,
  formatDistance,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
} from 'date-fns';
import TIM from 'tim-js-sdk';
import { defaultGroupAvatarWork, defaultUserAvatar } from './Avatar';

// Determine if it is a JSON string
export function isJSON(str: string) {
  // eslint-disable-next-line no-useless-escape
  if (
    /^[\],:{}\s]*$/.test(
      str
      // eslint-disable-next-line no-useless-escape
        .replace(/\\["\\\/bfnrtu]/g, '@')
      // eslint-disable-next-line no-useless-escape
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
    )
  ) {
    return true;
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

export const handleDisplayAvatar = (avatar: string, type:string = TIM.TYPES.CONV_C2C) => {
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
