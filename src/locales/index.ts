import { i18next } from '@tencentcloud/uikit-base-component-react';
import { message as enMessage } from './en-US/index';
import { message as zhMessage } from './zh-CN/index';
import { message as jaMessage } from './ja-JP/index';
import { message as koMessage } from './ko-KR/index';
import { message as twMessage } from './zh-TW/index';

const resources: Record<string, any> = {
  'en-US': {
    translation: enMessage,
  },
  'zh-CN': {
    translation: zhMessage,
  },
  'ja-JP': {
    translation: jaMessage,
  },
  'ko-KR': {
    translation: koMessage,
  },
  'zh-TW': {
    translation: twMessage,
  },
};

for (const [lng, resource] of Object.entries(resources)) {
  i18next.addResourceBundle(lng, 'translation', resource.translation, true, false);
}
