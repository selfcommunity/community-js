import {Button, IconButton, styled, Toolbar, ToolbarProps} from '@mui/material';
import React, {useMemo, useState} from 'react';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import NavigationToolbarMobileSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import {SearchAutocompleteProps} from '../SearchAutocomplete';
import SearchDialog from '../SearchDialog';
import NavigationSettingsIconButton from '../NavigationSettingsIconButton';
import ComposerIconButton from '../ComposerIconButton';

const PREFIX = 'SCNavigationToolbarMobile';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  search: `${PREFIX}-search`,
  searchDialog: `${PREFIX}-search-dialog`,
  composer: `${PREFIX}-composer`,
  settings: `${PREFIX}-settings`,
  settingsDialog: `${PREFIX}-settings-dialog`,
  login: `${PREFIX}-login`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NavigationToolbarMobileProps extends ToolbarProps {
  /**
   * Disable search action if possible
   */
  disableSearch?: boolean;
  /**
   * Props spread to SearchAutocomplete component
   */
  SearchAutocompleteProps?: SearchAutocompleteProps;
  /**
   * Prop to customize some routes
   */
  action?: React.ReactNode;
}

const PREFERENCES = [SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY, SCPreferences.LOGO_NAVBAR_LOGO_MOBILE];

/**
 * > API documentation for the Community-JS NavigationToolbarMobile component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NavigationToolbarMobile} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbar` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbar-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbar-logo|Styles applied to the logo element.|
 |search|.SCNavigationToolbar-search|Styles applied to the search button element|
 |searchDialog|.SCNavigationToolbar-search-dialog|Styles applied to the search dialog element|
 |settings|.SCNavigationToolbar-settings|Styles applied to the settings button element|
 |settingsDialog|.SCNavigationToolbar-settingsDialog|Styles applied to the settings dialog elements|
 *
 * @param inProps
 */
export default function NavigationToolbarMobile(inProps: NavigationToolbarMobileProps) {
  // PROPS
  const props: NavigationToolbarMobileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = '',
    disableSearch = false,
    SearchAutocompleteProps = {},
    children = null,
    action = (
      <>
        <ComposerIconButton className={classes.composer}></ComposerIconButton>
        <NavigationSettingsIconButton className={classes.settings}></NavigationSettingsIconButton>
      </>
    ),
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // STATE
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // HANDLERS
  const handleOpenSearch = () => {
    setSearchOpen(true);
  };
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  // RENDER
  if (scUserContext.loading) {
    return <NavigationToolbarMobileSkeleton />;
  }

  const _children = children || (
    <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} className={classes.logo}>
      <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]} alt="logo" />
    </Link>
  );

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {_children}
      {preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] && !disableSearch && (
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
      {scUserContext.user && action}
      {!scUserContext.user && (
        <Button className={classes.login} color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNIN_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
        </Button>
      )}
    </Root>
  );
}
