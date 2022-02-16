import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import UserSkeleton from './Skeleton';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, CardProps} from '@mui/material';
import {
  SCUserContext,
  SCPreferencesContext,
  SCPreferences,
  SCUserContextType,
  SCUserType,
  SCPreferencesContextType,
  useSCFetchUser,
  SCRoutingContextType,
  useSCRouting,
  Link,
  SCRoutes
} from '@selfcommunity/core';
import FollowUserButton from '../FollowUserButton';
import {FormattedMessage} from 'react-intl';
import {FollowUserButtonProps} from '../FollowUserButton/FollowUserButton';
import FriendshipUserButton from '../FriendshipUserButton';
import classNames from 'classnames';
import {FriendshipButtonProps} from '../FriendshipUserButton/FriendshipUserButton';

const PREFIX = 'SCUser';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Card, {
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
   * Props to spread to follow button
   * @default {}
   */
  followUserButtonProps?: FollowUserButtonProps;

  /**
   * Props to spread to connection button
   * @default {}
   */
  connectUserButtonProps?: FriendshipButtonProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function User(props: UserProps): JSX.Element {
  // PROPS
  const {
    id = null,
    user = null,
    handleIgnoreAction,
    className = null,
    autoHide = false,
    followUserButtonProps = {},
    connectUserButtonProps = {},
    ...rest
  } = props;

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id, user});

  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  /**
   * Render follow action
   * @return {JSX.Element}
   */
  function renderFollowActions() {
    /* TODO: render proper action based on redux connection (follow) store */
    return (
      <React.Fragment>
        {handleIgnoreAction && (
          <Button size="small" onClick={handleIgnoreAction}>
            <FormattedMessage defaultMessage="ui.user.ignore" id="ui.user.ignore" />
          </Button>
        )}
        <FollowUserButton user={scUser} {...followUserButtonProps} />
      </React.Fragment>
    );
  }

  /**
   * Render connection actions
   * @return {JSX.Element}
   */
  function renderConnectionActions() {
    /* TODO: render proper action based on redux connection (friendship) store */
    return (
      <React.Fragment>
        {handleIgnoreAction && (
          <Button size="small" onClick={handleIgnoreAction}>
            <FormattedMessage defaultMessage="ui.user.ignore" id="ui.user.ignore" />
          </Button>
        )}
        <FriendshipUserButton user={scUser} {...connectUserButtonProps} />
      </React.Fragment>
    );
  }

  /**
   * Render authenticated actions
   * @return {JSX.Element}
   */
  function renderAuthenticatedActions() {
    return <React.Fragment>{followEnabled ? renderFollowActions() : renderConnectionActions()}</React.Fragment>;
  }

  const u = (
    <React.Fragment>
      {scUser ? (
        <ListItem button={true} component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUser)}>
          <ListItemAvatar>
            <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
          </ListItemAvatar>
          <ListItemText primary={scUser.username} secondary={scUser.description} />
          <ListItemSecondaryAction className={classes.actions}>{scUserContext.user ? renderAuthenticatedActions() : null}</ListItemSecondaryAction>
        </ListItem>
      ) : (
        <UserSkeleton elevation={0} />
      )}
    </React.Fragment>
  );
  return (
    <Root {...rest} className={classNames(classes.root, className)}>
      <List>{u}</List>
    </Root>
  );
}
