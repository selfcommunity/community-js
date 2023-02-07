import {Box, Divider, Menu, MenuItem, MenuProps, styled, Typography} from '@mui/material';
import {
  Link,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useSCPreferences, useSCUser,
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import React, { useContext, useMemo } from 'react';
import {useThemeProps} from '@mui/system';
import {SCNavigationRoutesType} from '../../../types';
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

export interface SettingMenuProps extends MenuProps {
  /**
   * The single routes url
   */
  routes?: SCNavigationRoutesType;
}

const PREFERENCES = [SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED];

export default function SettingMenu(inProps: SettingMenuProps) {
  // PROPS
  const props: SettingMenuProps = useThemeProps({
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
      {routes.profile && (
        <MenuItem className={classes.item} key="profile" component={Link} to={routes.profile}>
          <FormattedMessage id="ui.header.settings.menuItem.profile" defaultMessage="ui.header.settings.menuItem.profile" />
        </MenuItem>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && routes.followings && (
        <MenuItem className={classes.item} key="followings" component={Link} to={routes.followings}>
          <FormattedMessage id="ui.header.settings.menuItem.followings" defaultMessage="ui.header.settings.menuItem.followings" />
        </MenuItem>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && routes.followers && (
        <MenuItem className={classes.item} key="followers" component={Link} to={routes.followers}>
          <FormattedMessage id="ui.header.settings.menuItem.followers" defaultMessage="ui.header.settings.menuItem.followers" />
        </MenuItem>
      )}
      {!preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED] && routes.connections && (
        <MenuItem className={classes.item} key="connections" component={Link} to={routes.connections}>
          <FormattedMessage id="ui.header.settings.menuItem.connections" defaultMessage="ui.header.settings.menuItem.connections" />
        </MenuItem>
      )}
      {routes.loyalty && (
        <MenuItem className={classes.item} key="loyaltyProgram" component={Link} to={routes.loyalty}>
          <FormattedMessage id="ui.header.settings.menuItem.loyalty" defaultMessage="ui.header.settings.menuItem.loyalty" />
        </MenuItem>
      )}
      {routes.peopleSuggestion && (
        <MenuItem className={classes.item} key="suggestedPeople" component={Link} to={routes.peopleSuggestion}>
          <FormattedMessage id="ui.header.settings.menuItem.interestingPeople" defaultMessage="ui.header.settings.menuItem.interestingPeople" />
        </MenuItem>
      )}
      {routes.followedPosts && (
        <MenuItem className={classes.item} key="followedPosts" component={Link} to={routes.followedPosts}>
          <FormattedMessage id="ui.header.settings.menuItem.postsFollowed" defaultMessage="ui.header.settings.menuItem.postsFollowed" />
        </MenuItem>
      )}
      {routes.followedDiscussions && (
        <MenuItem className={classes.item} key="followedDiscussions" component={Link} to={routes.followedDiscussions}>
          <FormattedMessage id="ui.header.settings.menuItem.discussionsFollowed" defaultMessage="ui.header.settings.menuItem.discussionsFollowed" />
        </MenuItem>
      )}
      {routes.messages && (
        <MenuItem className={classes.item} key="privateMessages" component={Link} to={routes.messages}>
          <FormattedMessage id="ui.header.settings.menuItem.privateMessages" defaultMessage="ui.header.settings.menuItem.privateMessages" />
        </MenuItem>
      )}
      {isAdmin && (
        <>
          <Divider />
          <MenuItem className={classes.item} key="platform" onClick={() => fetchPlatform('')}>
            <FormattedMessage id="ui.header.settings.menuItem.platform" defaultMessage="ui.header.settings.menuItem.platform" />
          </MenuItem>
          {routes.communityTour && (
            <MenuItem className={classes.item} key="communityTour" component={Link} to={routes.communityTour}>
              <FormattedMessage id="ui.header.settings.menuItem.communityTour" defaultMessage="ui.header.settings.menuItem.communityTour" />
            </MenuItem>
          )}
        </>
      )}
      {(isModerator || isAdmin) && (
        <>
          <Divider />
          <MenuItem className={classes.item} key="moderation" onClick={() => fetchPlatform('/moderation')}>
            <FormattedMessage id="ui.header.settings.menuItem.moderation" defaultMessage="ui.header.settings.menuItem.moderation" />
          </MenuItem>
        </>
      )}
      {routes.settings && (
        <MenuItem className={classes.item} key="settings" component={Link} to={routes.settings}>
          <FormattedMessage id="ui.header.settings.menuItem.settings" defaultMessage="ui.header.settings.menuItem.settings" />
        </MenuItem>
      )}
      <Divider />
      {routes.logout && (
        <MenuItem className={classes.item} key="logout" onClick={routes.logout}>
          <FormattedMessage id="ui.header.settings.menuItem.logout" defaultMessage="ui.header.settings.menuItem.logout" />
        </MenuItem>
      )}
    </Root>
  );
}
