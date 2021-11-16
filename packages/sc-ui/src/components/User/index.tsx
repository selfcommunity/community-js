import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import {UserBoxSkeleton} from '../Skeleton';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {AxiosResponse} from 'axios';
import {
  SCUserContext,
  SCPreferencesContext,
  http,
  Endpoints,
  SCPreferences,
  SCUserContextType,
  SCUserType,
  SCPreferencesContextType,
  Logger
} from '@selfcommunity/core';
import {SCOPE_SC_UI} from '../../constants/Errors';

const PREFIX = 'SCUser';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function User({id = null, user = null, ...rest}: {id?: number; user?: SCUserType; [p: string]: any}): JSX.Element {
  const [scUser, setSCUser] = useState<SCUserType>(user);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const connectionEnabled = !followEnabled;

  /**
   * If user not in props, attempt to get the user by id (in props) if exist
   */
  const fetchUser = useMemo(
    () => () => {
      http
        .request({
          url: Endpoints.User.url({id: id}),
          method: Endpoints.User.method
        })
        .then((res: AxiosResponse<SCUserType>) => {
          const data: SCUserType = res.data;
          setSCUser(data);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    },
    [id]
  );

  /**
   * Render follow action
   * @return {JSX.Element}
   */
  function renderFollowActions() {
    /* TODO: render proper action based on redux connection (follow) store */
    return (
      <React.Fragment>
        <Button size="small">Ignore</Button>
        <Button size="small" variant="outlined">
          Follow
        </Button>
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
        <Button size="small">Ignore</Button>
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
    return (
      <React.Fragment>
        {followEnabled ? renderFollowActions() : <React.Fragment>{connectionEnabled ? renderConnectionActions() : null}</React.Fragment>}
      </React.Fragment>
    );
  }

  /**
   * Render anonymous actions
   * @return {JSX.Element}
   */
  function renderAnonymousActions() {
    return <Button size="small">Go to Profile</Button>;
  }

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const u = (
    <React.Fragment>
      {scUser ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={scUser.username} src={scUser.avatar} />
          </ListItemAvatar>
          <ListItemText primary={scUser.username} secondary={scUser.description} />
          <ListItemSecondaryAction>{scAuthContext.user ? renderAuthenticatedActions() : renderAnonymousActions()}</ListItemSecondaryAction>
        </ListItem>
      ) : (
        <UserBoxSkeleton elevation={0} />
      )}
    </React.Fragment>
  );
  return (
    <Root {...rest}>
      <List>{u}</List>
    </Root>
  );
}
