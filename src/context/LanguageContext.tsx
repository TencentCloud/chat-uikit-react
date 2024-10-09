import {
  useState,
  useContext,
  createContext,
  useLayoutEffect,
  PropsWithChildren,
} from 'react';
import { useTranslation } from 'react-i18next';
import { TUITranslateService } from '@tencentcloud/chat-uikit-engine';

interface LanguageContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

interface LanguageProviderProps {
  language: string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function LanguageProvider(props: PropsWithChildren<Partial<LanguageProviderProps>>) {
  const {
    language: _language = 'en-US',
    children,
  } = props;

  const { i18n } = useTranslation();

  const [language, setLanguage] = useState(_language);

  useLayoutEffect(() => {
    i18n.changeLanguage(_language);
    setLanguage(_language);
  }, [_language, i18n]);

  useLayoutEffect(() => {
    document.documentElement.lang = _language;
  }, [_language]);

  const value = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { LanguageProvider, useLanguage, LanguageContextType };
