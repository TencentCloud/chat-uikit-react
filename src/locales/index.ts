import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';
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

i18next.use(initReactI18next).init({
  resources,
  lng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
});

const engineLocaleResources = {
  'en-US': enMessage,
  'zh-CN': zhMessage,
  'ja-JP': jaMessage,
  'ko-KR': koMessage,
};
TUITranslateService.provideLanguages(engineLocaleResources);
TUITranslateService.useI18n('en-US');

const { t } = i18next;
export { i18next, t };
