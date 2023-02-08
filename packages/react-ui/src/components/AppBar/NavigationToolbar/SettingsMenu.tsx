import {Divider, Menu, MenuItem, MenuProps, styled} from '@mui/material';
import {
  Link,
  SCFeatures,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import React, {useMemo} from 'react';
import {useThemeProps} from '@mui/system';
import {UserService} from '@selfcommunity/api-services';

const PREFIX = 'SCSettingMenu';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};
const Root = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.paper}`]: {
    minWidth: 370,
    padding: theme.spacing(2)
  },
  [`& .${classes.item}`]: {}
}));

export type SettingsMenuProps = MenuProps;

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED,
  SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED,
  SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED
];

export default function SettingsMenu(inProps: SettingsMenuProps) {
  // PROPS
  const props: SettingsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {PaperProps = {className: classes.paper}, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const roles = scUserContext.user && scUserContext.user.role;
  const isAdmin = roles && roles.includes('admin');
  const isModerator = roles && roles.includes('moderator');

  // HOOKS
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

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

  return (
    <Root className={classes.root} PaperProps={PaperProps} {...rest}>
      <MenuItem
        className={classes.item}
        key="profile"
        component={Link}
        to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}>
        <FormattedMessage id="ui.appBar.navigation.settings.menuItem.profile" defaultMessage="ui.appBar.navigation.settings.menuItem.profile" />
      </MenuItem>
      {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
        <MenuItem
          className={classes.item}
          key="followings"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWINGS_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage
            id="ui.appBar.navigation.settings.menuItem.followings"
            defaultMessage="ui.appBar.navigation.settings.menuItem.followings"
          />
        </MenuItem>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
        <MenuItem
          className={classes.item}
          key="followers"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWERS_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage id="ui.appBar.navigation.settings.menuItem.followers" defaultMessage="ui.appBar.navigation.settings.menuItem.followers" />
        </MenuItem>
      )}
      {!preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
        <MenuItem
          className={classes.item}
          key="connections"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage
            id="ui.appBar.navigation.settings.menuItem.connections"
            defaultMessage="ui.appBar.navigation.settings.menuItem.connections"
          />
        </MenuItem>
      )}
      {scPreferences.features.includes(SCFeatures.LOYALTY) && (
        <MenuItem className={classes.item} key="loyaltyProgram" component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.appBar.navigation.settings.menuItem.loyalty" defaultMessage="ui.appBar.navigation.settings.menuItem.loyalty" />
        </MenuItem>
      )}
      <MenuItem className={classes.item} key="suggestedPeople" component={Link} to={scRoutingContext.url(SCRoutes.PEOPLE_SUGGESTION_ROUTE_NAME, {})}>
        <FormattedMessage
          id="ui.appBar.navigation.settings.menuItem.interestingPeople"
          defaultMessage="ui.appBar.navigation.settings.menuItem.interestingPeople"
        />
      </MenuItem>
      {preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] && (
        <MenuItem
          className={classes.item}
          key="followedPosts"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage
            id="ui.appBar.navigation.settings.menuItem.postsFollowed"
            defaultMessage="ui.appBar.navigation.settings.menuItem.postsFollowed"
          />
        </MenuItem>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED] && (
        <MenuItem
          className={classes.item}
          key="followedDiscussions"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME, scUserContext.user)}>
          <FormattedMessage
            id="ui.appBar.navigation.settings.menuItem.discussionsFollowed"
            defaultMessage="ui.appBar.navigation.settings.menuItem.discussionsFollowed"
          />
        </MenuItem>
      )}
      <MenuItem
        className={classes.item}
        key="privateMessages"
        component={Link}
        to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}>
        <FormattedMessage
          id="ui.appBar.navigation.settings.menuItem.privateMessages"
          defaultMessage="ui.appBar.navigation.settings.menuItem.privateMessages"
        />
      </MenuItem>
      {isAdmin && (
        <>
          <Divider />
          <MenuItem className={classes.item} key="platform" onClick={() => fetchPlatform('')}>
            <FormattedMessage id="ui.appBar.navigation.settings.menuItem.platform" defaultMessage="ui.appBar.navigation.settings.menuItem.platform" />
          </MenuItem>
        </>
      )}
      {(isModerator || isAdmin) && (
        <>
          <Divider />
          <MenuItem className={classes.item} key="moderation" onClick={() => fetchPlatform('/moderation')}>
            <FormattedMessage
              id="ui.appBar.navigation.settings.menuItem.moderation"
              defaultMessage="ui.appBar.navigation.settings.menuItem.moderation"
            />
          </MenuItem>
        </>
      )}
      <MenuItem
        className={classes.item}
        key="settings"
        component={Link}
        to={scRoutingContext.url(SCRoutes.USER_PROFILE_SETTINGS_ROUTE_NAME, scUserContext.user)}>
        <FormattedMessage id="ui.appBar.navigation.settings.menuItem.settings" defaultMessage="ui.appBar.navigation.settings.menuItem.settings" />
      </MenuItem>
      <Divider />
      <MenuItem className={classes.item} key="logout" onClick={handleLogout}>
        <FormattedMessage id="ui.appBar.navigation.settings.menuItem.logout" defaultMessage="ui.appBar.navigation.settings.menuItem.logout" />
      </MenuItem>
    </Root>
  );
}
