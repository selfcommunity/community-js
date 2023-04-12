import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Divider,
  Icon,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {
  Link,
  SCFeatures,
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
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import {UserService} from '@selfcommunity/api-services';

const PREFIX = 'SCNavigationSettingsIconButton';

const classes = {
  root: `${PREFIX}-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.drawerRoot
})(({theme}) => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.menuRoot
})(({theme}) => ({}));

export interface NavigationSettingsIconButtonProps extends IconButtonProps {
  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  items?: any;
}

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED,
  SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED,
  SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED
];

/**
 * > API documentation for the Community-JS Navigation Settings Icon Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ComposerIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SNavigationSettingsIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SNavigationSettingsIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function NavigationSettingsIconButton(inProps: NavigationSettingsIconButtonProps): JSX.Element {
  // PROPS
  const props: NavigationSettingsIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, items = [], ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const roles = scUserContext.user && scUserContext.user.role;
  const isAdmin = roles && roles.includes('admin');
  const isModerator = roles && roles.includes('moderator');

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Fetches paltform url
   * @param query
   */
  const fetchPlatform = (query) => {
    UserService.getCurrentUserPlatform(query).then((res) => {
      const platformUrl = res.platform_url;
      window.open(platformUrl, '_blank').focus();
    });
  };

  const handleLogout = () => {
    scUserContext.logout();
  };

  const renderList = () => {
    if (isMobile) {
      return [
        <ListItem className={classes.item} key="profile">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.profile" defaultMessage="ui.navigationSettingsIconButton.profile" />
          </ListItemButton>
        </ListItem>,
        preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <ListItem className={classes.item} key="followings">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWINGS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage id="ui.navigationSettingsIconButton.followings" defaultMessage="ui.navigationSettingsIconButton.followings" />
            </ListItemButton>
          </ListItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <ListItem className={classes.item} key="followers">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWERS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage id="ui.navigationSettingsIconButton.followers" defaultMessage="ui.navigationSettingsIconButton.followers" />
            </ListItemButton>
          </ListItem>
        ),
        !preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <ListItem className={classes.item} key="connections">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage id="ui.navigationSettingsIconButton.connections" defaultMessage="ui.navigationSettingsIconButton.connections" />
            </ListItemButton>
          </ListItem>
        ),
        scPreferences.features.includes(SCFeatures.LOYALTY) && (
          <ListItem className={classes.item} key="loyaltyProgram">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
              <FormattedMessage id="ui.navigationSettingsIconButton.loyalty" defaultMessage="ui.navigationSettingsIconButton.loyalty" />
            </ListItemButton>
          </ListItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] && (
          <ListItem className={classes.item} key="followedPosts">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage id="ui.navigationSettingsIconButton.postsFollowed" defaultMessage="ui.navigationSettingsIconButton.postsFollowed" />
            </ListItemButton>
          </ListItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED] && (
          <ListItem className={classes.item} key="followedDiscussions">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.navigationSettingsIconButton.discussionsFollowed"
                defaultMessage="ui.navigationSettingsIconButton.discussionsFollowed"
              />
            </ListItemButton>
          </ListItem>
        ),
        <ListItem className={classes.item} key="privateMessages">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.navigationSettingsIconButton.privateMessages" defaultMessage="ui.navigationSettingsIconButton.privateMessages" />
          </ListItemButton>
        </ListItem>,
        ...(isAdmin
          ? [
              <Divider key="admin_divider" />,
              <ListItem className={classes.item} key="platform">
                <ListItemButton onClick={() => fetchPlatform('')}>
                  <FormattedMessage id="ui.navigationSettingsIconButton.platform" defaultMessage="ui.navigationSettingsIconButton.platform" />
                </ListItemButton>
              </ListItem>
            ]
          : []),
        ...(isModerator || isAdmin
          ? [
              <Divider key="moderation_divider" />,
              <ListItem className={classes.item} key="moderation">
                <ListItemButton onClick={() => fetchPlatform('/moderation')}>
                  <FormattedMessage id="ui.navigationSettingsIconButton.moderation" defaultMessage="ui.navigationSettingsIconButton.moderation" />
                </ListItemButton>
              </ListItem>
            ]
          : []),
        <ListItem className={classes.item} key="settings">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_SETTINGS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.settings" defaultMessage="ui.navigationSettingsIconButton.settings" />
          </ListItemButton>
        </ListItem>,
        <Divider key="divider" />,
        <ListItem className={classes.item} key="logout">
          <ListItemButton onClick={handleLogout}>
            <FormattedMessage id="ui.navigationSettingsIconButton.logout" defaultMessage="ui.navigationSettingsIconButton.logout" />
          </ListItemButton>
        </ListItem>
      ];
    } else {
      return [
        <MenuItem
          className={classes.item}
          key="profile"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage id="ui.navigationSettingsIconButton.profile" defaultMessage="ui.navigationSettingsIconButton.profile" />
        </MenuItem>,
        preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <MenuItem
            className={classes.item}
            key="followings"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWINGS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.followings" defaultMessage="ui.navigationSettingsIconButton.followings" />
          </MenuItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <MenuItem
            className={classes.item}
            key="followers"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWERS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.followers" defaultMessage="ui.navigationSettingsIconButton.followers" />
          </MenuItem>
        ),
        !preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <MenuItem
            className={classes.item}
            key="connections"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.connections" defaultMessage="ui.navigationSettingsIconButton.connections" />
          </MenuItem>
        ),
        scPreferences.features.includes(SCFeatures.LOYALTY) && (
          <MenuItem className={classes.item} key="loyaltyProgram" component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.navigationSettingsIconButton.loyalty" defaultMessage="ui.navigationSettingsIconButton.loyalty" />
          </MenuItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] && (
          <MenuItem
            className={classes.item}
            key="followedPosts"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.postsFollowed" defaultMessage="ui.navigationSettingsIconButton.postsFollowed" />
          </MenuItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED] && (
          <MenuItem
            className={classes.item}
            key="followedDiscussions"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage
              id="ui.navigationSettingsIconButton.discussionsFollowed"
              defaultMessage="ui.navigationSettingsIconButton.discussionsFollowed"
            />
          </MenuItem>
        ),
        <MenuItem
          className={classes.item}
          key="privateMessages"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.navigationSettingsIconButton.privateMessages" defaultMessage="ui.navigationSettingsIconButton.privateMessages" />
        </MenuItem>,
        ...(isAdmin
          ? [
              <Divider key="platform_divider" />,
              <MenuItem className={classes.item} key="platform" onClick={() => fetchPlatform('')}>
                <FormattedMessage id="ui.navigationSettingsIconButton.platform" defaultMessage="ui.navigationSettingsIconButton.platform" />
              </MenuItem>
            ]
          : []),
        ...(isModerator || isAdmin
          ? [
              <Divider key="moderation_divider" />,
              <MenuItem className={classes.item} key="moderation" onClick={() => fetchPlatform('/moderation')}>
                <FormattedMessage id="ui.navigationSettingsIconButton.moderation" defaultMessage="ui.navigationSettingsIconButton.moderation" />
              </MenuItem>
            ]
          : []),
        <MenuItem
          className={classes.item}
          key="settings"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_SETTINGS_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage id="ui.navigationSettingsIconButton.settings" defaultMessage="ui.navigationSettingsIconButton.settings" />
        </MenuItem>,
        <Divider key="divider" />,
        <MenuItem className={classes.item} key="logout" onClick={handleLogout}>
          <FormattedMessage id="ui.navigationSettingsIconButton.logout" defaultMessage="ui.navigationSettingsIconButton.logout" />
        </MenuItem>
      ];
    }
  };

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>more_vert</Icon>
      </Root>
      {isMobile ? (
        <SwipeableDrawerRoot
          className={classes.drawerRoot}
          anchor="bottom"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onOpen={handleOpen}
          PaperProps={{className: classes.paper}}>
          <List>{renderList()}</List>
        </SwipeableDrawerRoot>
      ) : (
        <MenuRoot
          className={classes.menuRoot}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{className: classes.paper}}>
          {renderList()}
        </MenuRoot>
      )}
    </>
  );
}
