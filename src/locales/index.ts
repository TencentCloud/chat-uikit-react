import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { message as enUSMessage } from './en/index';
import { message as zhCNMessage } from './zh_cn/index';

const resources = {
  en: {
    translation: enUSMessage,
  },
  zh: {
    translation: zhCNMessage,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const { t } = i18next;
export { i18next, t };
