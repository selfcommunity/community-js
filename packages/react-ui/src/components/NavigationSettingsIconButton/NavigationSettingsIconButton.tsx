import React, {useMemo, useState} from 'react';
import {
  Divider,
  Icon,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  useFetchMenuFooter,
  UserUtils,
  useSCPaymentsEnabled,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import {PreferenceService, UserService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger, sortByAttr} from '@selfcommunity/utils';
import {SCCustomMenuItemType, SCPreferenceName} from '@selfcommunity/types';
import {EXPLORE_MENU_ITEM} from '../Footer/constants';

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
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.drawerRoot
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.menuRoot
})(() => ({}));

export interface NavigationSettingsItem {
  label: React.ReactNode;
  href: string;
}

export interface NavigationSettingsIconButtonProps extends IconButtonProps {
  items?: NavigationSettingsItem[];
}

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED,
  SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED,
  SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED,
  SCPreferences.ADDONS_LOYALTY_POINTS_COLLECTION,
  SCPreferences.CONFIGURATIONS_ONBOARDING_ENABLED,
  SCPreferences.CONFIGURATIONS_ONBOARDING_HIDDEN,
  SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED,
  SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED
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
  const {className = null, items = [], ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // MEMO
  const isAdmin = useMemo(() => UserUtils.isAdmin(scUserContext.user), [scUserContext.user]);
  const isCommunityCreator = useMemo(() => UserUtils.isCommunityCreator(scUserContext.user), [scUserContext.user]);
  const isModerator = useMemo(() => UserUtils.isModerator(scUserContext.user), [scUserContext.user]);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {_menu} = useFetchMenuFooter(null);

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);
  const {isPaymentsEnabled} = useSCPaymentsEnabled();
  const connectionEnabled =
    SCPreferences.CONFIGURATIONS_CONNECTION_ENABLED in scPreferences.preferences &&
    scPreferences.preferences[SCPreferences.CONFIGURATIONS_CONNECTION_ENABLED].value;
  const exploreStreamEnabled =
    SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED in scPreferences.preferences &&
    scPreferences.preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED].value;

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Fetches platform url
   * @param query
   */
  const fetchPlatform = (query) => {
    UserService.getCurrentUserPlatform(query).then((res) => {
      const platformUrl = res.platform_url;
      window.open(platformUrl, '_blank').focus();
    });
  };

  /**
   * Handles preferences update
   */
  const handlePreferencesUpdate = () => {
    PreferenceService.getAllPreferences().then((preferences) => {
      const prefs = preferences['results'].reduce((obj, p) => ({...obj, [`${p.section}.${p.name}`]: p}), {});
      scPreferences.setPreferences(prefs);
    });
  };

  /**
   * Updates onBoarding dynamic preference
   */
  const showOnBoarding = () => {
    PreferenceService.updatePreferences({[`${SCPreferenceName.ONBOARDING_HIDDEN}`]: false})
      .then(() => {
        handlePreferencesUpdate();
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
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
        connectionEnabled && (
          <ListItem className={classes.item} key="connections">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage id="ui.navigationSettingsIconButton.connections" defaultMessage="ui.navigationSettingsIconButton.connections" />
            </ListItemButton>
          </ListItem>
        ),
        preferences[SCPreferences.ADDONS_LOYALTY_POINTS_COLLECTION] && (
          <ListItem className={classes.item} key="loyaltyProgram">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
              <FormattedMessage id="ui.navigationSettingsIconButton.loyalty" defaultMessage="ui.navigationSettingsIconButton.loyalty" />
            </ListItemButton>
          </ListItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] &&
          preferences[SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED] &&
          (UserUtils.isStaff(scUserContext.user) || UserUtils.isPublisher(scUserContext.user)) && (
            <ListItem className={classes.item} key="scheduledPosts">
              <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_SCHEDULED_POSTS_ROUTE_NAME, scUserContext.user)}>
                <FormattedMessage
                  id="ui.navigationSettingsIconButton.postsScheduled"
                  defaultMessage="ui.navigationSettingsIconButton.postsScheduled"
                />
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
        preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED] &&
          preferences[SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED] &&
          (UserUtils.isStaff(scUserContext.user) || UserUtils.isPublisher(scUserContext.user)) && (
            <ListItem className={classes.item} key="scheduledDiscussions">
              <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_SCHEDULED_DISCUSSIONS_ROUTE_NAME, scUserContext.user)}>
                <FormattedMessage
                  id="ui.navigationSettingsIconButton.discussionsScheduled"
                  defaultMessage="ui.navigationSettingsIconButton.discussionsScheduled"
                />
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
        preferences[SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED] && (
          <ListItem className={classes.item} key="privateMessages">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}>
              <FormattedMessage
                id="ui.navigationSettingsIconButton.privateMessages"
                defaultMessage="ui.navigationSettingsIconButton.privateMessages"
              />
            </ListItemButton>
          </ListItem>
        ),
        ...items.map((item: NavigationSettingsItem, index) => (
          <ListItem className={classes.item} key={`custom_item_${index}`}>
            <ListItemButton component={Link} to={item.href}>
              {item.label}
            </ListItemButton>
          </ListItem>
        )),
        ...(isAdmin
          ? [
              <Divider key="admin_divider" />,
              isCommunityCreator &&
                preferences[SCPreferences.CONFIGURATIONS_ONBOARDING_ENABLED] &&
                preferences[SCPreferences.CONFIGURATIONS_ONBOARDING_HIDDEN] && (
                  <ListItem className={classes.item} key="onboarding">
                    <ListItemButton onClick={showOnBoarding}>
                      <FormattedMessage id="ui.navigationSettingsIconButton.onboarding" defaultMessage="ui.navigationSettingsIconButton.onboarding" />
                      <ListItemIcon>
                        <Icon>magic_wand</Icon>
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                ),
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
                <ListItemButton onClick={() => fetchPlatform('/moderation/flags/')}>
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
        ...(isPaymentsEnabled
          ? [
              <Divider key="payments_divider" />,
              <ListItem className={classes.item} key="paymentsHistoryOrder">
                <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PAYMENTS_HISTORY_ORDERS_ROUTE_NAME, scUserContext.user)}>
                  <FormattedMessage
                    id="ui.navigationSettingsIconButton.historyOrders"
                    defaultMessage="ui.navigationSettingsIconButton.historyOrders"
                  />
                </ListItemButton>
              </ListItem>,
              <ListItem className={classes.item} key="myPaymentMethods">
                <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PAYMENT_METHODS_ROUTE_NAME, scUserContext.user)}>
                  <FormattedMessage
                    id="ui.navigationSettingsIconButton.myPaymentMethods"
                    defaultMessage="ui.navigationSettingsIconButton.myPaymentMethods"
                  />
                </ListItemButton>
              </ListItem>
            ]
          : []),
        <Divider key="footer_divider" />,
        ...[
          sortByAttr(_menu.items, 'order')
            .filter((item: SCCustomMenuItemType) => exploreStreamEnabled || item.url !== EXPLORE_MENU_ITEM)
            .map((item: SCCustomMenuItemType) => (
              <ListItem className={classes.item} key={item.id}>
                <ListItemButton component={Link} to={item.url}>
                  {item.label}
                </ListItemButton>
              </ListItem>
            ))
        ],
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
        connectionEnabled && (
          <MenuItem
            className={classes.item}
            key="connections"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.navigationSettingsIconButton.connections" defaultMessage="ui.navigationSettingsIconButton.connections" />
          </MenuItem>
        ),
        preferences[SCPreferences.ADDONS_LOYALTY_POINTS_COLLECTION] && (
          <MenuItem className={classes.item} key="loyaltyProgram" component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.navigationSettingsIconButton.loyalty" defaultMessage="ui.navigationSettingsIconButton.loyalty" />
          </MenuItem>
        ),
        preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] &&
          preferences[SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED] &&
          (UserUtils.isStaff(scUserContext.user) || UserUtils.isPublisher(scUserContext.user)) && (
            <MenuItem
              className={classes.item}
              key="scheduledPosts"
              component={Link}
              to={scRoutingContext.url(SCRoutes.USER_PROFILE_SCHEDULED_POSTS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage id="ui.navigationSettingsIconButton.postsScheduled" defaultMessage="ui.navigationSettingsIconButton.postsScheduled" />
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
        preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED] &&
          preferences[SCPreferences.CONFIGURATIONS_SCHEDULED_POSTS_ENABLED] &&
          (UserUtils.isStaff(scUserContext.user) || UserUtils.isPublisher(scUserContext.user)) && (
            <MenuItem
              className={classes.item}
              key="scheduledDiscussions"
              component={Link}
              to={scRoutingContext.url(SCRoutes.USER_PROFILE_SCHEDULED_DISCUSSIONS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.navigationSettingsIconButton.discussionsScheduled"
                defaultMessage="ui.navigationSettingsIconButton.discussionsScheduled"
              />
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
        preferences[SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED] && (
          <MenuItem
            className={classes.item}
            key="privateMessages"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.navigationSettingsIconButton.privateMessages" defaultMessage="ui.navigationSettingsIconButton.privateMessages" />
          </MenuItem>
        ),
        ...items.map((item: NavigationSettingsItem, index) => (
          <MenuItem className={classes.item} key={`custom_item_${index}`} component={Link} to={item.href}>
            {item.label}
          </MenuItem>
        )),
        ...(isAdmin
          ? [
              <Divider key="platform_divider" />,
              isCommunityCreator &&
                preferences[SCPreferences.CONFIGURATIONS_ONBOARDING_ENABLED] &&
                preferences[SCPreferences.CONFIGURATIONS_ONBOARDING_HIDDEN] && (
                  <MenuItem className={classes.item} key="onboarding" onClick={showOnBoarding}>
                    <FormattedMessage id="ui.navigationSettingsIconButton.onboarding" defaultMessage="ui.navigationSettingsIconButton.onboarding" />
                    <ListItemIcon>
                      <Icon>magic_wand</Icon>
                    </ListItemIcon>
                  </MenuItem>
                ),
              <MenuItem className={classes.item} key="platform" onClick={() => fetchPlatform('')}>
                <FormattedMessage id="ui.navigationSettingsIconButton.platform" defaultMessage="ui.navigationSettingsIconButton.platform" />
              </MenuItem>
            ]
          : []),
        ...(isModerator || isAdmin
          ? [
              <Divider key="moderation_divider" />,
              <MenuItem className={classes.item} key="moderation" onClick={() => fetchPlatform('/moderation/flags/')}>
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
        ...(isPaymentsEnabled
          ? [
              <Divider key="payments_divider" />,
              <MenuItem
                className={classes.item}
                key="historyOrders"
                component={Link}
                to={scRoutingContext.url(SCRoutes.USER_PAYMENTS_HISTORY_ORDERS_ROUTE_NAME, scUserContext.user)}>
                <FormattedMessage id="ui.navigationSettingsIconButton.historyOrders" defaultMessage="ui.navigationSettingsIconButton.historyOrders" />
              </MenuItem>,
              <MenuItem
                className={classes.item}
                key="myPaymentMethods"
                component={Link}
                to={scRoutingContext.url(SCRoutes.USER_PAYMENT_METHODS_ROUTE_NAME, scUserContext.user)}>
                <FormattedMessage
                  id="ui.navigationSettingsIconButton.myPaymentMethods"
                  defaultMessage="ui.navigationSettingsIconButton.myPaymentMethods"
                />
              </MenuItem>
            ]
          : []),
        <Divider key="footer_divider" />,
        ...[
          sortByAttr(_menu.items, 'order')
            .filter((item: SCCustomMenuItemType) => exploreStreamEnabled || item.url !== EXPLORE_MENU_ITEM)
            .map((item: SCCustomMenuItemType) => (
              <MenuItem className={classes.item} key={item.id} component={Link} to={item.url}>
                {item.label}
              </MenuItem>
            ))
        ],
        <Divider key="divider" />,
        <MenuItem className={classes.item} key="logout" onClick={handleLogout}>
          <FormattedMessage id="ui.navigationSettingsIconButton.logout" defaultMessage="ui.navigationSettingsIconButton.logout" />
        </MenuItem>
      ];
    }
  };

  // RENDER
  if (!scUserContext.user) {
    return null;
  }

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>more_vert</Icon>
      </Root>
      {Boolean(anchorEl) && (
        <>
          {isMobile ? (
            <SwipeableDrawerRoot
              onClick={() => setAnchorEl(null)}
              className={classes.drawerRoot}
              anchor="bottom"
              open
              onClose={handleClose}
              onOpen={handleOpen}
              PaperProps={{className: classes.paper}}
              disableSwipeToOpen>
              <List>{renderList()}</List>
            </SwipeableDrawerRoot>
          ) : (
            <MenuRoot
              onClick={() => setAnchorEl(null)}
              className={classes.menuRoot}
              anchorEl={anchorEl}
              open
              onClose={handleClose}
              PaperProps={{className: classes.paper}}>
              {renderList()}
            </MenuRoot>
          )}
        </>
      )}
    </>
  );
}
