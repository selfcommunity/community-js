import {Box, Button, IconButton, styled, Toolbar, ToolbarProps} from '@mui/material';
import React, {useMemo, useState} from 'react';
import {Link, SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import SettingsDrawer from './SettingsDrawer';
import NavigationToolbarMobileSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import {SearchAutocompleteProps} from '../../SearchAutocomplete';
import {SCNavigationRoutesType} from '../../../types';
import SearchDialog from '../../SearchDialog';

const PREFIX = 'SCNavigationToolbar';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  grow: `${PREFIX}-grow`,
  search: `${PREFIX}-search`,
  searchDialog: `${PREFIX}-search-dialog`,
  settings: `${PREFIX}-settings`,
  settingsDialog: `${PREFIX}-settings-dialog`,
  login: `${PREFIX}-login`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.logo}`]: {
    maxHeight: theme.mixins.toolbar.minHeight
  },
  [`& .${classes.grow}`]: {
    flexGrow: 1
  }
}));

export interface NavigationToolbarMobileProps extends ToolbarProps {
  /**
   * Searchbar props
   */
  SearchAutocompleteProps?: SearchAutocompleteProps;
  /**
   * The single routes url to pass to menu
   */
  routes?: SCNavigationRoutesType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Other props
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY, SCPreferences.LOGO_NAVBAR_LOGO_MOBILE];

/**
 * > API documentation for the Community-JS Desktop AppBar component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AppBar} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCDesktopHeader` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCDesktopHeader-root|Styles applied to the root element.|
 |registerButton|.SCDesktopHeader-register-button|Styles applied to the register button element.|
 |iconButton|.SCDesktopHeader-icon-button|Styles applied to the icon button elements.|
 |logoContainer|.SCDesktopHeader-logo-container|Styles applied to the logo container element|
 |tabsLContainer|.SCDesktopHeader-tabs-container|Styles applied to the tabs container element|
 |searchBarContainer|.SCDesktopHeader-search-bar-container|Styles applied to the search bar container element|
 |rightBlockContainer|.SCDesktopHeader-right-block-container|Styles applied to the right container elements|
 *
 * @param inProps
 */
export default function NavigationToolbarMobile(inProps: NavigationToolbarMobileProps) {
  // PROPS
  const props: NavigationToolbarMobileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {routes = {}, className, SearchAutocompleteProps = {}, children = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // STATE
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false);

  // HANDLERS
  const handleOpenSearch = () => {
    setSearchOpen(true);
  };
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  // RENDER
  if (scUserContext.loading && !children) {
    return <NavigationToolbarMobileSkeleton />;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {children ? (
        children
      ) : (
        <>
          {routes.home ? (
            <Link to={routes.home}>
              <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]} alt="logo" className={classes.logo} />
            </Link>
          ) : (
            <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]} alt="logo" className={classes.logo} />
          )}
          <Box className={classes.grow}></Box>
          {preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] && (
            <>
              <IconButton className={classes.search} onClick={handleOpenSearch}>
                <Icon>search</Icon>
              </IconButton>
              <SearchDialog
                className={classes.searchDialog}
                fullScreen
                open={searchOpen}
                SearchAutocompleteProps={{...SearchAutocompleteProps, onClear: handleCloseSearch}}></SearchDialog>
            </>
          )}
          {scUserContext.user && (
            <>
              <IconButton className={classes.settings} onClick={handleOpenSettings}>
                <Icon>more_vert</Icon>
              </IconButton>
              <SettingsDrawer
                id="setting-swipe-menu"
                className={classes.settingsDialog}
                anchor="bottom"
                open={settingsOpen}
                onClose={handleCloseSettings}
                onClick={handleCloseSettings}
                onOpen={handleOpenSettings}
                routes={routes}
              />
            </>
          )}
          {!scUserContext.user && routes.login && (
            <Button className={classes.login} color="inherit" onClick={routes.login}>
              <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
            </Button>
          )}
        </>
      )}
    </Root>
  );
}
