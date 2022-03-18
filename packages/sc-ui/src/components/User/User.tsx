import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import UserSkeleton from './Skeleton';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, CardProps} from '@mui/material';
import {SCUserContext, SCUserContextType, SCUserType, useSCFetchUser, SCRoutingContextType, useSCRouting, Link, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {FollowUserButtonProps} from '../FollowUserButton/FollowUserButton';
import classNames from 'classnames';
import {FriendshipButtonProps} from '../FriendshipUserButton/FriendshipUserButton';
import ConnectionUserButton from '../ConnectionUserButton';
import Widget from '../Widget';

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
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  '& .MuiList-root': {
    padding: 0
  }
}));

export interface UserProps extends Pick<CardProps, Exclude<keyof CardProps, 'id'>> {
  /**
   * Id of user object
   * @default null
   */
  id?: number;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Hides user component
   * @default false
   */
  autoHide?: boolean;
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
  showFollowers: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI User component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {User} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUser` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUser-root|Styles applied to the root element.|
 |avatar|.SCUser-avatar|Styles applied to the avatar element.|
 |actions|.SCUser-actions|Styles applied to actions section.|

 * @param props
 */
export default function User(props: UserProps): JSX.Element {
  // PROPS
  const {
    id = null,
    user = null,
    handleIgnoreAction,
    className = null,
    autoHide = false,
    followConnectUserButtonProps = {},
    showFollowers = false,
    ...rest
  } = props;

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id, user});

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
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
  const u = (
    <React.Fragment>
      {scUser ? (
        <ListItem button={true} component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUser)}>
          <ListItemAvatar>
            <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={scUser.username}
            secondary={showFollowers ? `${intl.formatMessage(messages.userFollowers, {total: scUser.followers_counter})}` : scUser.description}
          />
          <ListItemSecondaryAction className={classes.actions}>{renderAuthenticatedActions()}</ListItemSecondaryAction>
        </ListItem>
      ) : (
        <UserSkeleton elevation={0} />
      )}
    </React.Fragment>
  );

  /**
   * Renders root object
   */
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      <List>{u}</List>
    </Root>
  );
}
