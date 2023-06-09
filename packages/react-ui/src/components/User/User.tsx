import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import UserSkeleton from './Skeleton';
import {Avatar, Badge, Button, Chip} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  useSCFetchUser,
  useSCPreferences,
  useSCRouting
} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {FollowUserButtonProps} from '../FollowUserButton/FollowUserButton';
import classNames from 'classnames';
import {FriendshipButtonProps} from '../FriendshipUserButton/FriendshipUserButton';
import ConnectionUserButton from '../ConnectionUserButton';
import {useThemeProps} from '@mui/system';
import BaseItemButton from '../../shared/BaseItemButton';
import {WidgetProps} from '../Widget';

const messages = defineMessages({
  userFollowers: {
    id: 'ui.user.userFollowers',
    defaultMessage: 'ui.user.userFollowers'
  }
});

const PREFIX = 'SCUser';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  staffBadge: `${PREFIX}-staff-badge`,
  staffBadgeLabel: `${PREFIX}-staff-badge-label`,
  staffBadgeIcon: `${PREFIX}-staff-badge-icon`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: any) => ({}));

export interface UserProps extends WidgetProps {
  /**
   * User Id
   * @default null
   */
  userId?: number;
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Handles actions ignore
   * @default null
   */
  handleIgnoreAction?: (u) => void;
  /**
   * Props to spread to follow/friendship button
   * @default {}
   */
  followConnectUserButtonProps?: FollowUserButtonProps | FriendshipButtonProps;
  /**
   *  Prop to show user followers as secondary text
   * @default false
   */
  showFollowers?: boolean;
  /**
   * Badge content to show as user avatar badge if show reaction is true.
   */
  badgeContent?: any;
  /**
   * Any other properties
   */
  [p: string]: any;
}
const PREFERENCES = [SCPreferences.STAFF_STAFF_BADGE_LABEL, SCPreferences.STAFF_STAFF_BADGE_ICON];

/**
 * > API documentation for the Community-JS User component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a user item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/User)

 #### Import

 ```jsx
 import {User} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUser` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUser-root|Styles applied to the root element.|
 |avatar|.SCUser-avatar|Styles applied to the avatar element.|
 |staffBadge|.SCUser-staff-badge|Styles applied to the reaction icon element.|
 |staffBadgeLabel|.SCUser-staff-badge-label|Styles applied to the staff badge label element.|
 |staffBadgeIcon|.SCUser-staff-badge-icon|Styles applied to the staff badge icon element.|
 *
 * @param inProps
 */
export default function User(inProps: UserProps): JSX.Element {
  // PROPS
  const props: UserProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    userId = null,
    user = null,
    handleIgnoreAction,
    className = null,
    followConnectUserButtonProps = {},
    showFollowers = false,
    elevation,
    badgeContent = null,
    ...rest
  } = props;

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);
  const hasBadge = scUser && scUser.community_badge;

  // INTL
  const intl = useIntl();

  /**
   * Render authenticated actions
   * @return {JSX.Element}
   */
  function renderAuthenticatedActions() {
    return (
      <React.Fragment>
        {handleIgnoreAction && (
          <Button size="small" onClick={handleIgnoreAction}>
            <FormattedMessage defaultMessage="ui.user.ignore" id="ui.user.ignore" />
          </Button>
        )}
        <ConnectionUserButton user={scUser} {...followConnectUserButtonProps} />
      </React.Fragment>
    );
  }

  /**
   * Renders user object
   */
  if (!scUser) {
    return <UserSkeleton elevation={elevation} />;
  }

  /**
   * Renders root object
   */
  return (
    <Root
      elevation={elevation}
      {...rest}
      className={classNames(classes.root, className)}
      ButtonBaseProps={{component: Link, to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUser)}}
      image={
        badgeContent ? (
          <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} badgeContent={badgeContent}>
            <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
          </Badge>
        ) : (
          <Badge
            invisible={!hasBadge}
            classes={{badge: classes.staffBadgeIcon}}
            overlap="circular"
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            badgeContent={
              preferences ? (
                <Avatar
                  className={classes.staffBadge}
                  alt={preferences[SCPreferences.STAFF_STAFF_BADGE_LABEL]}
                  src={preferences[SCPreferences.STAFF_STAFF_BADGE_ICON]}
                />
              ) : null
            }>
            <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
          </Badge>
        )
      }
      primary={
        hasBadge && preferences ? (
          <>
            {scUser.username}
            <Chip component="span" className={classes.staffBadgeLabel} size="small" label={preferences[SCPreferences.STAFF_STAFF_BADGE_LABEL]} />
          </>
        ) : (
          scUser.username
        )
      }
      secondary={showFollowers ? `${intl.formatMessage(messages.userFollowers, {total: scUser.followers_counter})}` : scUser.description}
      actions={renderAuthenticatedActions()}
    />
  );
}
