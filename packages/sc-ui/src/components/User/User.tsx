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
  useSCFetchUser
} from '@selfcommunity/core';
import FollowUserButton from '../FollowUserButton';

const PREFIX = 'SCUser';

const classes = {
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
   * Callback function on follow action.
   * @default null
   */
  onFollowProps?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function User(props: UserProps): JSX.Element {
  const {id = null, user = null, handleIgnoreAction, className = null, autoHide = false, onFollowProps, ...rest} = props;
  const {scUser, setSCUser} = useSCFetchUser({id, user});
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
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
            Ignore
          </Button>
        )}
        <FollowUserButton user={scUser} onFollow={onFollowProps} />
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
            Ignore
          </Button>
        )}
        <Button size="small" variant="outlined">
          Connect
        </Button>
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

  /**
   * Render anonymous actions
   * @return {JSX.Element}
   */
  function renderAnonymousActions() {
    return <Button size="small">Go to Profile</Button>;
  }

  const u = (
    <React.Fragment>
      {scUser ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={scUser.username} src={scUser.avatar} className={classes.avatar} />
          </ListItemAvatar>
          <ListItemText primary={scUser.username} secondary={scUser.description} />
          <ListItemSecondaryAction className={classes.actions}>
            {scUserContext.user ? renderAuthenticatedActions() : renderAnonymousActions()}
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <UserSkeleton elevation={0} />
      )}
    </React.Fragment>
  );
  return (
    <Root {...rest} className={className}>
      <List>{u}</List>
    </Root>
  );
}
