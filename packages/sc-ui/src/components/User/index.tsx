import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import {UserBoxSkeleton} from '../Skeleton';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {SCUserContext, SCPreferencesContext, SCPreferences, SCUserContextType, SCUserType, SCPreferencesContextType} from '@selfcommunity/core';
import useSCFetchUser from '../../../../sc-core/src/hooks/useSCFetchUser';
import FollowConnect from '../FollowConnect';

const PREFIX = 'SCUser';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function User({
  id = null,
  user = null,
  followed = null,
  ...rest
}: {
  id?: number;
  user?: SCUserType;
  [p: string]: any;
  followed?: boolean;
}): JSX.Element {
  const {scUser, setSCUser} = useSCFetchUser({id, user});
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const scAuthContext: SCUserContextType = useContext(SCUserContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const connectionEnabled = !followEnabled;

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
        <FollowConnect user={scUser} followed={followed} />
        {/*{followEnabled ? renderFollowActions() : <React.Fragment>{connectionEnabled ? renderConnectionActions() : null}</React.Fragment>}*/}
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
