import {
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
  setTheme: (theme: string) => void;
  setColors: (colors: Record<string, string>) => void;
}

interface ThemeProviderProps {
  theme: string;
  colors: Record<string, string> | undefined;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function ThemeProvider(props: PropsWithChildren<Partial<ThemeProviderProps>>) {
  const {
    theme: _theme = 'light',
    colors: _colors,
    children,
  } = props;

  const [theme, setTheme] = useState(_theme);
  const [colors, setColors] = useState(_colors);

  useLayoutEffect(() => {
    document.documentElement.dataset.uikitTheme = theme;
  }, [theme]);

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
