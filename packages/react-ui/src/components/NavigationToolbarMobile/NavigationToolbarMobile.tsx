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
import NavigationSettingsIconButton, {NavigationSettingsIconButtonProps} from '../NavigationSettingsIconButton';
import ComposerIconButton from '../ComposerIconButton';
import NavigationMenuIconButton from '../NavigationMenuIconButton';

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
})(() => ({}));

export interface NavigationToolbarMobileProps extends ToolbarProps {
  /**
   * Disable search action if possible
   */
  disableSearch?: boolean;
  /**
   * Disable composer action if possible
   */
  disableComposer?: boolean;
  /**
   * Props spread to SearchAutocomplete component
   */
  SearchAutocompleteProps?: SearchAutocompleteProps;
  /**
   * Actions to be inserted before composer IconButton
   */
  startActions?: React.ReactNode | null;
  /**
   * Actions to be inserted after Private Messages IconButton
   */
  endActions?: React.ReactNode | null;
  /**
   * Component for Navigation Settings
   */
  NavigationSettingsIconButtonComponent?: (inProps: NavigationSettingsIconButtonProps) => JSX.Element;
}

const PREFERENCES = [SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY, SCPreferences.LOGO_NAVBAR_LOGO_MOBILE];

/**
 * > API documentation for the Community-JS Navigation Toolbar Mobile component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the mobile application header.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/NavigationToolbarMobile)

 #### Import

 ```jsx
 import {NavigationToolbarMobile} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbarMobile` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbarMobile-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbarMobile-logo|Styles applied to the logo element.|
 |search|.SCNavigationToolbarMobile-search|Styles applied to the search button element|
 |searchDialog|.SCNavigationToolbarMobile-search-dialog|Styles applied to the search dialog element|
 |composer|.SCNavigationToolbarMobile-composer|Styles applied to the composer component|
 |settings|.SCNavigationToolbarMobile-settings|Styles applied to the settings button element|
 |settingsDialog|.SCNavigationToolbarMobile-settingsDialog|Styles applied to the settings dialog elements|
 |login|.SCNavigationToolbarMobile-login|Styles applied to the login element.|
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
    disableComposer = false,
    SearchAutocompleteProps = {},
    children = null,
    startActions = null,
    endActions = null,
    NavigationSettingsIconButtonComponent = NavigationSettingsIconButton,
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
    <>
      <NavigationMenuIconButton />
      <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} className={classes.logo}>
        <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]} alt="logo" />
      </Link>
    </>
  );

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {_children}
      {startActions}
      {(preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user) && !disableSearch && (
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
      {scUserContext.user && !disableComposer && <ComposerIconButton className={classes.composer}></ComposerIconButton>}
      {endActions}
      {scUserContext.user ? (
        <NavigationSettingsIconButtonComponent className={classes.settings}></NavigationSettingsIconButtonComponent>
      ) : (
        <Button className={classes.login} color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNIN_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
        </Button>
      )}
    </Root>
  );
}
