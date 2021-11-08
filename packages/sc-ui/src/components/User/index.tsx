import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {UserBoxSkeleton} from '../Skeleton';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {AxiosResponse} from 'axios';
import {SCContext, SCContextType, Endpoints, http, SCPreferences, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import {SCPreferencesContext} from '../../../../sc-core/src/components/provider/SCPreferencesProvider';
import {SCPreferencesType} from '../../../../sc-core/src/types/context';

const PREFIX = 'SCUser';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function User({scUserId = null, scUser = null, contained = true}: {scUserId?: number; scUser?: SCUserType; contained: boolean}): JSX.Element {
  const [user, setUser] = useState<SCUserType>(scUser);
  const scPreferencesContext: SCPreferencesType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const connectionEnabled = !followEnabled;

  /**
   * If user not in props, attempt to get the user by id (in props) if exist
   */
  function fetchUser() {
    http
      .request({
        url: Endpoints.User.url({id: scUserId}),
        method: Endpoints.User.method
      })
      .then((res: AxiosResponse<SCUserType>) => {
        const data: SCUserType = res.data;
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
    if (!user) {
      fetchUser();
    }
  }, []);

  const u = (
    <React.Fragment>
      {user ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={user.username} src={user.avatar} />
          </ListItemAvatar>
          <ListItemText primary={user.username} secondary={user.description} />
          <ListItemSecondaryAction>
            {scAuthContext.user && connectionEnabled ? renderAuthenticatedActions() : renderAnonymousActions()}
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <UserBoxSkeleton contained />
      )}
    </React.Fragment>
  );

  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{u}</List>
        </CardContent>
      </Root>
    );
  }
  return u;
}

export default User;
