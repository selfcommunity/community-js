import React, {createContext, useContext, useState} from 'react';
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import getTheme from '../../../themes/theme';
import {SCContextType} from '@selfcommunity/core';
import {useSCContext} from '../SCContextProvider';
import {SCThemeContextType} from '../../../types';
import {SCPreferencesType} from '../../../types/context';
import {useSCPreferencesContext} from '../SCPreferencesProvider';

/**
 * Create Global Context
 * Consuming this context in one of the following ways:
 *  1. <SCThemeContext.Consumer>
 *       {(theme,) => (...)}
 *     </SCThemeContext.Consumer>
 *  2. const scThemeContext: SCThemeContextType = useContext(SCThemeContext);
 *  3. const scThemeContext: SCThemeContextType = useSCTheme();
 */
export const SCThemeContext = createContext<SCThemeContextType>({} as SCThemeContextType);

/**
 * This component makes the `theme` available down the React tree.
 * It should preferably be used at **the root of your component tree**.
 * See: https://mui.com/system/styled/
 */
export default function SCThemeProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const scPreferencesContext: SCPreferencesType = useSCPreferencesContext();
  const [theme, setTheme] = useState<Record<string, any>>(getTheme(scContext.settings.theme, scPreferencesContext.preferences));

  const setCustomTheme = (theme) => {
    setTheme(getTheme(theme, scPreferencesContext.preferences));
  };

  return (
    <StyledEngineProvider injectFirst>
      <SCThemeContext.Provider value={{theme, setTheme: setCustomTheme}}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </SCThemeContext.Provider>
    </StyledEngineProvider>
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
