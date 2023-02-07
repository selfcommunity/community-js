import {Avatar, Badge, Box, Button, IconButton, styled, Toolbar, ToolbarProps} from '@mui/material';
import React, {useMemo} from 'react';
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
import SettingMenu from './SettingMenu';
import NavigationToolbarSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import NotificationMenu from './NotificationMenu';
import SearchAutocomplete, {SearchAutocompleteProps} from '../../SearchAutocomplete';
import {SCNavigationRoutesType} from '../../../types';

const PREFIX = 'SCNavigationToolbar';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  register: `${PREFIX}-register`,
  navigation: `${PREFIX}-navigation`,
  home: `${PREFIX}-home`,
  explore: `${PREFIX}-explore`,
  search: `${PREFIX}-search`,
  profile: `${PREFIX}-profile`,
  notification: `${PREFIX}-notification`,
  messages: `${PREFIX}-messages`,
  settings: `${PREFIX}-settings`,
  active: `${PREFIX}-active`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.logo}`]: {
    maxHeight: theme.mixins.toolbar.minHeight
  },
  [`& .${classes.navigation}`]: {
    flexGrow: 1,
    textAlign: 'center'
  },
  [`& .${classes.search}`]: {
    flexGrow: 1
  }
}));

export interface NavigationToolbarProps extends ToolbarProps {
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

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED,
  SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY,
  SCPreferences.LOGO_NAVBAR_LOGO
];

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
export default function NavigationToolbar(inProps: NavigationToolbarProps) {
  // PROPS
  const props: NavigationToolbarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {routes = {}, className, SearchAutocompleteProps = {}, ...rest} = props;

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
  const path = typeof window !== 'undefined' ? window.location.pathname : null;
  const [anchorSetting, setAnchorMenu] = React.useState(null);
  const [anchorNotification, setAnchorNotification] = React.useState(null);

  // HANDLERS
  const handleOpenSettingMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseSettingMenu = () => {
    setAnchorMenu(null);
  };
  const handleOpenNotificationMenu = (event) => {
    setAnchorNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorNotification(null);
  };

  // RENDER
  if (scUserContext.loading) {
    return <NavigationToolbarSkeleton />;
  }

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {routes.home ? (
        <Link to={routes.home}>
          <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} alt={'logo'} className={classes.logo} />
        </Link>
      ) : (
        <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} alt={'logo'} className={classes.logo} />
      )}
      {!scUserContext.user && routes.register && (
        <Button color="inherit" component={Link} to={routes.register} className={classes.register}>
          <FormattedMessage id="ui.appBar.navigation.register" defaultMessage="ui.appBar.navigation.register" />
        </Button>
      )}
      <Box className={classes.navigation}>
        {routes.home && scUserContext.user && (
          <IconButton
            className={classNames(classes.home, {[classes.active]: path.startsWith(routes.home)})}
            aria-label="Home"
            to={routes.home}
            component={Link}>
            <Icon>home</Icon>
          </IconButton>
        )}
        {routes.explore &&
          preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED] &&
          (preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user) && (
            <IconButton
              className={classNames(classes.explore, {[classes.active]: path.startsWith(routes.explore)})}
              aria-label="Explore"
              to={routes.explore}
              component={Link}>
              <Icon>explore</Icon>
            </IconButton>
          )}
      </Box>
      {preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user ? (
        <SearchAutocomplete className={classes.search} blurOnSelect {...SearchAutocompleteProps} />
      ) : (
        <Box className={classes.search} />
      )}
      {scUserContext.user ? (
        <>
          <IconButton
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}
            aria-label="Profile"
            className={classes.profile}>
            <Avatar alt={scUserContext.user.username} src={scUserContext.user.avatar} />
          </IconButton>
          <>
            <IconButton
              className={classNames(classes.notification, {[classes.active]: path.startsWith(routes.notifications)})}
              aria-label="Notification"
              onClick={handleOpenNotificationMenu}>
              <Badge
                badgeContent={scUserContext.user.unseen_notification_banners_counter + scUserContext.user.unseen_interactions_counter}
                color="secondary">
                <Icon>notifications_active</Icon>
              </Badge>
            </IconButton>
            <NotificationMenu
              id="notification-menu"
              anchorEl={anchorNotification}
              open={Boolean(anchorNotification)}
              onClose={handleCloseNotificationMenu}
              onClick={handleCloseNotificationMenu}
              detail={routes.notifications}
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            />
          </>
          {routes.messages && (
            <IconButton
              className={classNames(classes.messages, {[classes.active]: path.startsWith(routes.messages)})}
              aria-label="Messages"
              to={routes.messages}
              component={Link}>
              <Badge badgeContent={scUserContext.user.unseen_notification_banners_counter} color="secondary">
                <Icon>email</Icon>
              </Badge>
            </IconButton>
          )}
          <IconButton onClick={handleOpenSettingMenu} className={classes.settings}>
            {anchorSetting ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
          </IconButton>
          <SettingMenu
            id="setting-menu"
            anchorEl={anchorSetting}
            open={Boolean(anchorSetting)}
            onClose={handleCloseSettingMenu}
            onClick={handleCloseSettingMenu}
            routes={routes}
            transformOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          />
        </>
      ) : routes.login ? (
        <Button color="inherit" onClick={routes.login}>
          <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
        </Button>
      ) : null}
    </Root>
  );
}
