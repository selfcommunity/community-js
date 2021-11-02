import React, {createContext, useContext, useState} from 'react';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';
import getTheme from '../../../themes/theme';
import {SCContextType} from '@selfcommunity/core';
import {useSCContext} from '../SCContextProvider';
import {SCThemeContextType} from '../../../types';

/**
 * Create Global Context
 * Consuming this context:
 *  1. <SCThemeContext.Consumer>
 *       {(theme,) => (...)}
 *     </SCThemeContext.Consumer>
 *  2. const scContext: SCThemeContext = useContext(SCContext);
 */
export const SCThemeContext = createContext<SCThemeContextType>({} as SCThemeContextType);

/**
 * This component makes the `theme` available down the React tree.
 * It should preferably be used at **the root of your component tree**.
 * See: https://mui.com/system/styled/
 */
export default function SCThemeProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const [theme, setTheme] = useState<object>(getTheme(scContext.settings.theme, scContext.preferences));

  return (
    <StyledEngineProvider injectFirst>
      <SCThemeContext.Provider value={{theme, setTheme}}>{children}</SCThemeContext.Provider>
    </StyledEngineProvider>
  );
}

/**
 * Export hoc to inject the base theme to components
 * @param WrappedComponent
 */
export const withSCTheme = (WrappedComponent) => (props) => {
  const scThemeContext: SCThemeContextType = useContext(SCThemeContext);
  return (
    <ThemeProvider theme={scThemeContext.theme}>
      <WrappedComponent setTheme={scThemeContext.setTheme} {...props} />
    </ThemeProvider>
  );
};
