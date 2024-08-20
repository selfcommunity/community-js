import { Avatar, Badge, Button, ButtonBaseProps, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeProps } from '@mui/system';
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
import { SCUserType } from '@selfcommunity/types';
import classNames from 'classnames';
import React, { ReactNode, useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import BaseItemButton from '../../shared/BaseItemButton';
import UserAvatar from '../../shared/UserAvatar';
import UserDeletedSnackBar from '../../shared/UserDeletedSnackBar';
import ConnectionUserButton from '../ConnectionUserButton';
import { FollowUserButtonProps } from '../FollowUserButton/FollowUserButton';
import { FriendshipButtonProps } from '../FriendshipUserButton/FriendshipUserButton';
import { WidgetProps } from '../Widget';
import { PREFIX } from './constants';
import UserSkeleton from './Skeleton';

const messages = defineMessages({
  userFollowers: {
    id: 'ui.user.userFollowers',
    defaultMessage: 'ui.user.userFollowers'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  staffBadgeLabel: `${PREFIX}-staff-badge-label`,
  groupAdminBadgeLabel: `${PREFIX}-group-admin-badge-label`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({ theme }: any) => ({}));

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
   * If true, shows a custom label next to the user username
   * @default false
   */
  isGroupAdmin?: boolean;
  /**
   * Prop to add actions
   * @default null
   */
  actions?: React.ReactNode;
  /**
   * Props to spread to the button
   * @default {}
   */
  buttonProps?: ButtonBaseProps | null;
  secondary?: ReactNode | null;
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
 |staffBadgeLabel|.SCUser-staff-badge-label|Styles applied to the staff badge label element.|

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
    actions = null,
    isGroupAdmin = false,
    buttonProps = null,
    secondary = null,
    ...rest
  } = props;

  // STATE
  const { scUser, setSCUser } = useSCFetchUser({ id: userId, user });

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
  const [openAlert, setOpenAlert] = useState<boolean>(false);

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
    <>
      <Root
        elevation={elevation}
        {...rest}
        className={classNames(classes.root, className)}
        ButtonBaseProps={
          buttonProps ??
          (scUser.deleted
            ? { onClick: () => setOpenAlert(true) }
            : { component: Link, to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUser) })
        }
        image={
          badgeContent ? (
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={badgeContent}>
              <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
            </Badge>
          ) : (
            <UserAvatar hide={!hasBadge}>
              <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
            </UserAvatar>
          )
        }
        primary={
          (hasBadge && preferences) || isGroupAdmin ? (
            <>
              {scUser.username}
              <Chip
                component="span"
                className={isGroupAdmin ? classes.groupAdminBadgeLabel : classes.staffBadgeLabel}
                size="small"
                label={
                  isGroupAdmin ? (
                    <FormattedMessage defaultMessage="ui.user.group.admin" id="ui.user.group.admin" />
                  ) : (
                    preferences[SCPreferences.STAFF_STAFF_BADGE_LABEL]
                  )
                }
              />
            </>
          ) : (
            scUser.username
          )
        }
        secondary={
          secondary || (showFollowers ? `${intl.formatMessage(messages.userFollowers, { total: scUser.followers_counter })}` : scUser.description)
        }
        actions={actions ?? renderAuthenticatedActions()}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
