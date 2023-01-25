import React, {createContext, useContext, useState} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import getTheme from '../../../themes/theme';
import {SCContextType, SCPreferencesContextType} from '../../../types/context';
import {useSCContext} from '../SCContextProvider';
import {SCThemeContextType, SCThemeType} from '../../../types';
import {useSCPreferences} from '../SCPreferencesProvider';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

/**
 * Creates Global Context
 *
 :::tipContext can be consumed in one of the following ways:

 ```jsx
 1. <SCThemeContext.Consumer>{(theme,) => (...)}</SCThemeContext.Consumer>
 ```
 ```jsx
 2. const scThemeContext: SCThemeContextType = useContext(SCThemeContext);
 ```
 ```jsx
 3. const scThemeContext: SCThemeContextType = useSCTheme();
 ````

 :::

 */
export const SCThemeContext = createContext<SCThemeContextType>({} as SCThemeContextType);

/**
 * #### Description:
 * This component makes the `theme` available down the React tree.
 * It should preferably be used at **the root of your component tree**.
 * See: https://mui.com/system/styled/
 *
 * @param children
 * @return
 * ```jsx
 * <SCThemeContext.Provider value={{theme, setTheme: setCustomTheme}}>
 * <ThemeProvider theme={theme}>{children}</ThemeProvider>
 * </SCThemeContext.Provider>
 * ```
 */
export default function SCThemeProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const [theme, setTheme] = useState<SCThemeType>(getTheme(scContext.settings.theme, scPreferencesContext.preferences));

  /**
   * Set custom theme
   * Merge with scPreferencesContext.preferences
   * @param theme
   */
  const setCustomTheme = (theme: SCThemeType) => {
    setTheme(getTheme(theme, scPreferencesContext.preferences));
  };

  /**
   * Update theme if initial conf changes
   */
  useDeepCompareEffectNoCheck(() => {
    setCustomTheme(theme);
  }, [scContext.settings.theme]);

  return (
    <SCThemeContext.Provider value={{theme, setTheme: setCustomTheme}}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SCThemeContext.Provider>
  );
}

/**
 * Export hoc to inject the base theme to components
 * @param Component
 */
export const withSCTheme = (Component) => (props) => {
  const scThemeContext: SCThemeContextType = useContext(SCThemeContext);
  return (
    <ThemeProvider theme={scThemeContext.theme}>
      <Component setTheme={scThemeContext.setTheme} {...props} />
    </ThemeProvider>
  );
};

/**
 * Let's only export the `useSCTheme` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCTheme(): SCThemeContextType {
  return useContext(SCThemeContext);
}
