import { PropsWithChildren, useContext, createContext } from 'react';
import type {
  ChatSDK,
  Conversation,
} from '@tencentcloud/chat';
import { TUILogin } from '@tencentcloud/tui-core';
import { ThemeProvider, useTheme } from './ThemeContext';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { UIManagerProvider } from './UIManagerContext';

interface UIKitContextType {
  chat: ChatSDK;
}

interface UIKitProviderProps {
  chat?: ChatSDK;
  language?: string;
  theme?: string;
  colors?: Record<string, string>;
  customClasses?: string;
  activeConversation?: Conversation;
}

const UIKitContext = createContext<UIKitContextType | null>(null);

function UIKitProvider(props: PropsWithChildren<UIKitProviderProps>) {
  const {
    chat = TUILogin.getContext().chat,
    language,
    theme,
    colors,
    customClasses,
    activeConversation,
    children,
  } = props;

  return (
    <LanguageProvider language={language}>
      <ThemeProvider theme={theme} colors={colors}>
        <UIKitContext.Provider value={{ chat }}>
          <UIManagerProvider activeConversation={activeConversation} customClasses={customClasses}>
            {children}
          </UIManagerProvider>
        </UIKitContext.Provider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

const useUIKit = (componentName?: string) => {
  const languageContext = useLanguage();
  const themeContext = useTheme();
  const uikitContext = useContext(UIKitContext);
  if (!uikitContext) {
    throw new Error('useUIKit must be used within a UIKitProvider');
  }
  return {
    ...themeContext,
    ...languageContext,
    ...uikitContext,
  };
};

export {
  UIKitProvider,
  useUIKit,
};
