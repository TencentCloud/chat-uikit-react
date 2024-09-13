import {
  format,
  formatDistance,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
} from 'date-fns';
import { enGB, zhCN, ja, ko, zhTW } from 'date-fns/locale';
import TencentCloudChat from '@tencentcloud/chat';
import { TUIStore, StoreName } from '@tencentcloud/chat-uikit-engine';
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

export const handleDisplayAvatar = (avatar: string, type: string = TencentCloudChat.TYPES.CONV_C2C) => {
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

export const getTimeStamp = (time: number, language = 'en-US') => {
  const locales: any = {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enGB,
    'ja-JP': ja,
    'ko-KR': ko,
  };
  if (!time) {
    return '';
  }
  if (!isThisYear(time)) {
    return format(time, 'yyyy MMM dd', {
      locale: locales[language],
    });
  }
  if (isToday(time)) {
    return format(time, 'p', {
      locale: locales[language],
    });
  }
  if (isYesterday(time)) {
    return formatDistance(time, new Date(), {
      locale: locales[language],
    });
  }
  if (isThisWeek(time)) {
    return format(time, 'eeee', {
      locale: locales[language],
    });
  }
  return format(time, 'MMM dd', {
    locale: locales[language],
  });
};

export function enableSampleTaskStatus(taskKey: string) {
  const tasks = TUIStore.getData(StoreName.APP, 'tasks');
  if (taskKey in tasks && !tasks[taskKey]) {
    tasks[taskKey] = true;
    TUIStore.update(StoreName.APP, 'tasks', tasks);
  }
}
