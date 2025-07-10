import { i18next } from '@tencentcloud/uikit-base-component-react';
import { en_US } from './en-US';
import { zh_CN } from './zh-CN';
import { ko_KR } from './ko-KR';
import { ja_JP } from './ja-JP';
import { zh_TW } from './zh-TW';

const resources: Record<string, any> = {
  'en-US': {
    translation: en_US,
  },
  'zh-CN': {
    translation: zh_CN,
  },
  'ja-JP': {
    translation: ja_JP,
  },
  'ko-KR': {
    translation: ko_KR,
  },
  'zh-TW': {
    translation: zh_TW,
  }
};

for (const [lng, resource] of Object.entries(resources)) {
  i18next.addResourceBundle(lng, 'translation', resource.translation, true, false);
}

