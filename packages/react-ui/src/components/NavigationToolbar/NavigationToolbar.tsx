import {Avatar, Badge, Box, Button, IconButton, styled, Toolbar, ToolbarProps, Tooltip} from '@mui/material';
import React, {useMemo} from 'react';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import NavigationToolbarSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import NotificationMenu, {NotificationsMenuProps} from './NotificationMenu';
import SearchAutocomplete, {SearchAutocompleteProps} from '../SearchAutocomplete';
import NavigationSettingsIconButton from '../NavigationSettingsIconButton';
import ComposerIconButton from '../ComposerIconButton';
import {SCFeatureName} from '@selfcommunity/types';

const PREFIX = 'SCNavigationToolbar';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  register: `${PREFIX}-register`,
  navigation: `${PREFIX}-navigation`,
  home: `${PREFIX}-home`,
  explore: `${PREFIX}-explore`,
  search: `${PREFIX}-search`,
  composer: `${PREFIX}-composer`,
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
})(({theme}: {theme: SCThemeType}) => ({
  [`& .${classes.logo} img`]: {
    maxHeight: theme.mixins.toolbar.minHeight
  },
  [`& .${classes.navigation}`]: {
    flexGrow: 1,
    textAlign: 'center'
  },
  [`& .${classes.search}`]: {
    flexGrow: 1
  },
  [`& .${classes.profile} .MuiAvatar-root`]: {
    width: theme.selfcommunity.user.avatar.sizeMedium,
    height: theme.selfcommunity.user.avatar.sizeMedium
  }
}));

export interface NavigationToolbarProps extends ToolbarProps {
  /**
   * Searchbar props
   */
  SearchAutocompleteProps?: SearchAutocompleteProps;
  /**
   * The navigation path
   */
  value: string;
  /**
   * Prop to customize some routes
   */
  action?: React.ReactNode;
  /**
   * Callback on open notification menu
   */
  onOpenNotificationMenu?: () => void;
  /**
   * Callback on close notification menu
   */
  onCloseNotificationMenu?: () => void;
  /**
   * Props to spread to the NotificationsMenu
   * @default {}
   */
  NotificationMenuProps?: Omit<NotificationsMenuProps, 'anchorEl' | 'open' | 'onClose' | 'onClick' | 'transformOrigin' | 'anchorOrigin'>;
}

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED,
  SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY,
  SCPreferences.LOGO_NAVBAR_LOGO,
  SCPreferences.ADDONS_CLOSED_COMMUNITY
];

/**
 * > API documentation for the Community-JS NavigationToolbar component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NavigationToolbar} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbar` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbar-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbar-logo|Styles applied to the logo element.|
 |register|.SCNavigationToolbar-register|Styles applied to the register button elements.|
 |navigation|.SCNavigationToolbar-navigation|Styles applied to the navigation container element|
 |home|.SCNavigationToolbar-home|Styles applied to the home button|
 |explore|.SCNavigationToolbar-explore|Styles applied to the explore button|
 |search|.SCNavigationToolbar-search|Styles applied to the search component|
 |profile|.SCNavigationToolbar-profile|Styles applied to the profile button|
 |notification|.SCNavigationToolbar-notification|Styles applied to the notification button|
 |messages|.SCNavigationToolbar-messages|Styles applied to the messages button|
 |settings|.SCNavigationToolbar-settings|Styles applied to the settings button|
 |active|.SCNavigationToolbar-active|Styles applied to the active button on navigation|

 *
 * @param inProps
 */
export default function NavigationToolbar(inProps: NavigationToolbarProps) {
  // PROPS
  const props: NavigationToolbarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    value = '',
    className = '',
    SearchAutocompleteProps = {},
    action = <NavigationSettingsIconButton className={classes.settings}></NavigationSettingsIconButton>,
    children = null,
    NotificationMenuProps = {},
    onOpenNotificationMenu,
    onCloseNotificationMenu,
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
  const privateMessagingEnabled = useMemo(() => scPreferences.features.includes(SCFeatureName.PRIVATE_MESSAGING), [scPreferences.features]);

  // STATE
  const [anchorNotification, setAnchorNotification] = React.useState(null);

  // HANDLERS
  const handleOpenNotificationMenu = (event) => {
    setAnchorNotification(event.currentTarget);
    onOpenNotificationMenu && onOpenNotificationMenu();
  };

  const handleCloseNotificationMenu = () => {
    setAnchorNotification(null);
    onCloseNotificationMenu && onCloseNotificationMenu();
  };

  // RENDER
  if (scUserContext.loading) {
    return <NavigationToolbarSkeleton />;
  }

  const _children = children || (
    <Box className={classes.navigation}>
      {scUserContext.user && (
        <IconButton
          className={classNames(classes.home, {[classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {}))})}
          aria-label="Home"
          to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})}
          component={Link}>
          <Icon>home</Icon>
        </IconButton>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED] &&
        (preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user) && (
          <IconButton
            className={classNames(classes.explore, {[classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {}))})}
            aria-label="Explore"
            to={scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {})}
            component={Link}>
            <Icon>explore</Icon>
          </IconButton>
        )}
    </Box>
  );

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} className={classes.logo}>
        <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} alt="logo"></img>
      </Link>
      {!scUserContext.user && !preferences[SCPreferences.ADDONS_CLOSED_COMMUNITY] && (
        <Button color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNUP_ROUTE_NAME, {})} className={classes.register}>
          <FormattedMessage id="ui.appBar.navigation.register" defaultMessage="ui.appBar.navigation.register" />
        </Button>
      )}
      {_children}
      {preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user ? (
        <SearchAutocomplete className={classes.search} blurOnSelect {...SearchAutocompleteProps} />
      ) : (
        <Box className={classes.search} />
      )}
      {scUserContext.user ? (
        <>
          <ComposerIconButton className={classes.composer}></ComposerIconButton>
          <Tooltip title={scUserContext.user.username}>
            <IconButton
              component={Link}
              to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}
              aria-label="Profile"
              className={classes.profile}>
              <Avatar alt={scUserContext.user.username} src={scUserContext.user.avatar} />
            </IconButton>
          </Tooltip>
          <>
            <IconButton
              className={classNames(classes.notification, {
                [classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {}))
              })}
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
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
              {...NotificationMenuProps}
            />
          </>
          {privateMessagingEnabled && (
            <IconButton
              className={classNames(classes.messages, {
                [classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {}))
              })}
              aria-label="Messages"
              to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}
              component={Link}>
              <Badge badgeContent={0} color="secondary">
                <Icon>email</Icon>
              </Badge>
            </IconButton>
          )}
          {action}
        </>
      ) : (
        <Button color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNIN_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
        </Button>
      )}
    </Root>
  );
}
