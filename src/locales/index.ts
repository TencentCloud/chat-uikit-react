import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { message as enMessage } from './en-US/index';
import { message as zhMessage } from './zh-CN/index';
import { message as jaMessage } from './ja-JP/index';
import { message as koMessage } from './ko-KR/index';

const resources = {
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
  }
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
});

const { t } = i18next;
export { i18next, t };
