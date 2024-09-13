import React, {
  useState,
  useContext,
  createContext,
  useLayoutEffect,
  PropsWithChildren,
} from 'react';

import '../styles/index.scss';

interface ThemeContextType {
  theme: string;
  colors: Record<string, string> | undefined;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  setColors: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>;
}

interface ThemeProviderProps {
  theme: string;
  colors: Record<string, string> | undefined;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const supportedThemes = ['light', 'dark'];

function ThemeProvider(props: PropsWithChildren<Partial<ThemeProviderProps>>) {
  const {
    theme: _theme = 'light',
    colors: _colors,
    children,
  } = props;

  if (supportedThemes.indexOf(_theme) === -1) {
    throw new Error(`Theme ${_theme} is not supported, please check the supported themes list: [${supportedThemes.join(', ')}]`);
  }

  const [theme, setTheme] = useState(_theme);
  const [colors, setColors] = useState(_colors);

  useLayoutEffect(() => {
    document.documentElement.dataset.uikitTheme = _theme;
    setTheme(_theme);
  }, [_theme]);

  const value = {
    theme,
    colors,
    setTheme,
    setColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeProvider, useTheme, ThemeContextType };
