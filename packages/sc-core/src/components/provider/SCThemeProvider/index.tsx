import React, {useContext} from 'react';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';
import getTheme from '../../../themes/theme';
import {SCContextType} from '@selfcommunity/core';
import {useSCContext} from '../SCContextProvider';

/**
 * This component makes the `theme` available down the React tree.
 * It should preferably be used at **the root of your component tree**.
 */
function SCThemeProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const _theme = getTheme(scContext.settings.theme, scContext.preferences);
  // https://mui.com/system/styled/
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={_theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}

export default SCThemeProvider;
