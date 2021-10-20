import React from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';
import getTheme from '../../../themes/theme';

class SCThemeProvider extends React.Component {
  render() {
    const {theme, children, preferences} = this.props;
    const _theme = getTheme(theme, preferences);
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={_theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

SCThemeProvider.defaultProps = {
  preferences: {},
  theme: {},
};

SCThemeProvider.propTypes = {
  children: PropTypes.node,
  preferences: PropTypes.object,
  theme: PropTypes.object,
};

export default SCThemeProvider;
