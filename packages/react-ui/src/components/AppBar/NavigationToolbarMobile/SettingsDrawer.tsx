import {Divider, List, ListItem, ListItemButton, styled, SwipeableDrawer, SwipeableDrawerProps} from '@mui/material';
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
import {SCNavigationRoutesType} from '../../../types';
import {UserService} from '@selfcommunity/api-services';

const PREFIX = 'SCSettingDrawer';

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};
const Root = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.paper}`]: {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
  },
  [`& .${classes.item}`]: {}
}));

export type SettingsDrawerProps = SwipeableDrawerProps;

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED,
  SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED,
  SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED
];

export default function SettingsDrawer(inProps: SettingsDrawerProps) {
  // PROPS
  const props: SettingsDrawerProps = useThemeProps({
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
  console.log(scPreferences.features);

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
      <List>
        <ListItem className={classes.item} key="profile">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.appBar.navigation.settings.menuItem.profile" defaultMessage="ui.appBar.navigation.settings.menuItem.profile" />
          </ListItemButton>
        </ListItem>
        {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <ListItem className={classes.item} key="followings">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWINGS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.appBar.navigation.settings.menuItem.followings"
                defaultMessage="ui.appBar.navigation.settings.menuItem.followings"
              />
            </ListItemButton>
          </ListItem>
        )}
        {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <ListItem className={classes.item} key="followers">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWERS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.appBar.navigation.settings.menuItem.followers"
                defaultMessage="ui.appBar.navigation.settings.menuItem.followers"
              />
            </ListItemButton>
          </ListItem>
        )}
        {!preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && (
          <ListItem className={classes.item} key="connections">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.appBar.navigation.settings.menuItem.connections"
                defaultMessage="ui.appBar.navigation.settings.menuItem.connections"
              />
            </ListItemButton>
          </ListItem>
        )}
        {scPreferences.features.includes(SCFeatures.LOYALTY) && (
          <ListItem className={classes.item} key="loyaltyProgram">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.LOYALTY_ROUTE_NAME, {})}>
              <FormattedMessage id="ui.appBar.navigation.settings.menuItem.loyalty" defaultMessage="ui.appBar.navigation.settings.menuItem.loyalty" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem className={classes.item} key="suggestedPeople">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.PEOPLE_SUGGESTION_ROUTE_NAME, {})}>
            <FormattedMessage
              id="ui.appBar.navigation.settings.menuItem.interestingPeople"
              defaultMessage="ui.appBar.navigation.settings.menuItem.interestingPeople"
            />
          </ListItemButton>
        </ListItem>
        {preferences[SCPreferences.CONFIGURATIONS_POST_TYPE_ENABLED] && (
          <ListItem className={classes.item} key="followedPosts">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.appBar.navigation.settings.menuItem.postsFollowed"
                defaultMessage="ui.appBar.navigation.settings.menuItem.postsFollowed"
              />
            </ListItemButton>
          </ListItem>
        )}
        {preferences[SCPreferences.CONFIGURATIONS_DISCUSSION_TYPE_ENABLED] && (
          <ListItem className={classes.item} key="followedDiscussions">
            <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME, scUserContext.user)}>
              <FormattedMessage
                id="ui.appBar.navigation.settings.menuItem.discussionsFollowed"
                defaultMessage="ui.appBar.navigation.settings.menuItem.discussionsFollowed"
              />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem className={classes.item} key="privateMessages">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}>
            <FormattedMessage
              id="ui.appBar.navigation.settings.menuItem.privateMessages"
              defaultMessage="ui.appBar.navigation.settings.menuItem.privateMessages"
            />
          </ListItemButton>
        </ListItem>
        {isAdmin && (
          <>
            <Divider />
            <ListItem className={classes.item} key="platform">
              <ListItemButton onClick={() => fetchPlatform('')}>
                <FormattedMessage
                  id="ui.appBar.navigation.settings.menuItem.platform"
                  defaultMessage="ui.appBar.navigation.settings.menuItem.platform"
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {(isModerator || isAdmin) && (
          <>
            <Divider />
            <ListItem className={classes.item} key="moderation">
              <ListItemButton onClick={() => fetchPlatform('/moderation')}>
                <FormattedMessage
                  id="ui.appBar.navigation.settings.menuItem.moderation"
                  defaultMessage="ui.appBar.navigation.settings.menuItem.moderation"
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <ListItem className={classes.item} key="settings">
          <ListItemButton component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_SETTINGS_ROUTE_NAME, scUserContext.user)}>
            <FormattedMessage id="ui.appBar.navigation.settings.menuItem.settings" defaultMessage="ui.appBar.navigation.settings.menuItem.settings" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem className={classes.item}>
          <ListItemButton onClick={handleLogout}>
            <FormattedMessage id="ui.appBar.navigation.settings.menuItem.logout" defaultMessage="ui.appBar.navigation.settings.menuItem.logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Root>
  );
}
