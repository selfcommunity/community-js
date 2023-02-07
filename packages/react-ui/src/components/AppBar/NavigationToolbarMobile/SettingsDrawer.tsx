import {Divider, List, ListItem, ListItemButton, styled, SwipeableDrawer, SwipeableDrawerProps} from '@mui/material';
import {Link, SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
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

export interface SettingsDrawerProps extends SwipeableDrawerProps {
  /**
   * The single routes url
   */
  routes?: SCNavigationRoutesType;
}

const PREFERENCES = [SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED];

export default function SettingsDrawer(inProps: SettingsDrawerProps) {
  // PROPS
  const props: SettingsDrawerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {routes = {}, PaperProps = {className: classes.paper}, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const roles = scUserContext.user && scUserContext.user.role;
  const isAdmin = roles && roles.includes('admin');
  const isModerator = roles && roles.includes('moderator');

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

  return (
    <Root className={classes.root} PaperProps={PaperProps} {...rest}>
      <List>
        {routes.profile && (
          <ListItem className={classes.item} key="profile">
            <ListItemButton component={Link} to={routes.profile}>
              <FormattedMessage id="ui.header.settings.menuItem.profile" defaultMessage="ui.header.settings.menuItem.profile" />
            </ListItemButton>
          </ListItem>
        )}
        {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && routes.followings && (
          <ListItem className={classes.item} key="followings">
            <ListItemButton component={Link} to={routes.followings}>
              <FormattedMessage id="ui.header.settings.menuItem.followings" defaultMessage="ui.header.settings.menuItem.followings" />
            </ListItemButton>
          </ListItem>
        )}
        {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && routes.followers && (
          <ListItem className={classes.item} key="followers">
            <ListItemButton component={Link} to={routes.followers}>
              <FormattedMessage id="ui.header.settings.menuItem.followers" defaultMessage="ui.header.settings.menuItem.followers" />
            </ListItemButton>
          </ListItem>
        )}
        {!preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && routes.connections && (
          <ListItem className={classes.item} key="connections">
            <ListItemButton component={Link} to={routes.connections}>
              <FormattedMessage id="ui.header.settings.menuItem.connections" defaultMessage="ui.header.settings.menuItem.connections" />
            </ListItemButton>
          </ListItem>
        )}
        {routes.loyalty && (
          <ListItem className={classes.item} key="loyaltyProgram">
            <ListItemButton component={Link} to={routes.loyalty}>
              <FormattedMessage id="ui.header.settings.menuItem.loyalty" defaultMessage="ui.header.settings.menuItem.loyalty" />
            </ListItemButton>
          </ListItem>
        )}
        {routes.peopleSuggestion && (
          <ListItem className={classes.item} key="suggestedPeople">
            <ListItemButton component={Link} to={routes.peopleSuggestion}>
              <FormattedMessage id="ui.header.settings.menuItem.interestingPeople" defaultMessage="ui.header.settings.menuItem.interestingPeople" />
            </ListItemButton>
          </ListItem>
        )}
        {routes.followedPosts && (
          <ListItem className={classes.item} key="followedPosts">
            <ListItemButton component={Link} to={routes.followedPosts}>
              <FormattedMessage id="ui.header.settings.menuItem.postsFollowed" defaultMessage="ui.header.settings.menuItem.postsFollowed" />
            </ListItemButton>
          </ListItem>
        )}
        {routes.followedDiscussions && (
          <ListItem className={classes.item} key="followedDiscussions">
            <ListItemButton component={Link} to={routes.followedDiscussions}>
              <FormattedMessage
                id="ui.header.settings.menuItem.discussionsFollowed"
                defaultMessage="ui.header.settings.menuItem.discussionsFollowed"
              />
            </ListItemButton>
          </ListItem>
        )}
        {routes.messages && (
          <ListItem className={classes.item} key="privateMessages">
            <ListItemButton component={Link} to={routes.messages}>
              <FormattedMessage id="ui.header.settings.menuItem.privateMessages" defaultMessage="ui.header.settings.menuItem.privateMessages" />
            </ListItemButton>
          </ListItem>
        )}
        {isAdmin && (
          <>
            <Divider />
            <ListItem className={classes.item} key="platform">
              <ListItemButton onClick={() => fetchPlatform('')}>
                <FormattedMessage id="ui.header.settings.menuItem.platform" defaultMessage="ui.header.settings.menuItem.platform" />
              </ListItemButton>
            </ListItem>
            {routes.communityTour && (
              <ListItem className={classes.item} key="communityTour">
                <ListItemButton component={Link} to={routes.communityTour}>
                  <FormattedMessage id="ui.header.settings.menuItem.communityTour" defaultMessage="ui.header.settings.menuItem.communityTour" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
        {(isModerator || isAdmin) && (
          <>
            <Divider />
            <ListItem className={classes.item} key="moderation">
              <ListItemButton onClick={() => fetchPlatform('/moderation')}>
                <FormattedMessage id="ui.header.settings.menuItem.moderation" defaultMessage="ui.header.settings.menuItem.moderation" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {routes.settings && (
          <ListItem className={classes.item} key="settings">
            <ListItemButton component={Link} to={routes.settings}>
              <FormattedMessage id="ui.header.settings.menuItem.settings" defaultMessage="ui.header.settings.menuItem.settings" />
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        {routes.logout && (
          <ListItem className={classes.item}>
            <ListItemButton component={Link} to={routes.logout}>
              <FormattedMessage id="ui.header.settings.menuItem.logout" defaultMessage="ui.header.settings.menuItem.logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Root>
  );
}
