import React from 'react';
import {styled} from '@mui/material/styles';
import UserSkeleton from './Skeleton';
import {Avatar, Badge, Button} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchUser, useSCRouting} from '@selfcommunity/react-core';
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
  root: `${PREFIX}-root`
};

const Root = styled(BaseItemButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
   *  Prop to show reaction badge on user avatar when showing feedObj reactions list
   * @default false
   */
  showReaction?: boolean;
  /**
   * Reaction icon to show as user avatar badge if show reaction is true.
   */
  reaction?: any;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User component. Learn about the available props and the CSS API.

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
    showReaction = false,
    reaction,
    ...rest
  } = props;

  const SmallAvatar = styled(Avatar)(({theme}) => ({
    width: 12,
    height: 12,
    backgroundColor: theme.palette.common.white,
    border: `2px solid ${theme.palette.background.paper}`
  }));

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

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
        showReaction ? (
          <Badge
            overlap="circular"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            badgeContent={<SmallAvatar alt={reaction.label} src={reaction.image} />}>
            <Avatar alt={scUser.username} src={scUser.avatar} />
          </Badge>
        ) : (
          <Avatar alt={scUser.username} src={scUser.avatar} />
        )
      }
      primary={scUser.username}
      secondary={showFollowers ? `${intl.formatMessage(messages.userFollowers, {total: scUser.followers_counter})}` : scUser.description}
      actions={renderAuthenticatedActions()}
    />
  );
}
