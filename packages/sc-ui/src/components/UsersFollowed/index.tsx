import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserType} from '@selfcommunity/core';
import PeopleSuggestionSkeleton from '../Skeleton/PeopleSuggestionSkeleton';
import User from '../User';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCUserFollowers';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function UsersFollowed({scPersonId = null}: {scPersonId?: number}): JSX.Element {
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const connectionEnabled = !followEnabled;
  const [users, setUsers] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [followed, setFollowed] = useState<boolean>(false);

  function fetchUserFollowed() {
    http
      .request({
        url: Endpoints.UsersFollowed.url({id: scPersonId}),
        method: Endpoints.UsersFollowed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setUsers(data.results);
        setHasMore(data.count > visibleUsers);
        setLoading(false);
        setTotal(data.count);
        setFollowed(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUserConnections() {
    http
      .request({
        url: Endpoints.UserConnections.url({id: scPersonId}),
        method: Endpoints.UserConnections.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setUsers(data.results);
        setHasMore(data.count > visibleUsers);
        setLoading(false);
        setTotal(data.count);
        setFollowed(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function loadUsers() {
    setVisibleUsers((prevVisibleUsers) => prevVisibleUsers + 3);
  }

  useEffect(() => {
    {
      followEnabled ? fetchUserFollowed() : fetchUserConnections();
    }
  }, []);

  if (loading) {
    return <PeopleSuggestionSkeleton />;
  }

  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">Friends</Typography>
        <List>
          {users.slice(0, visibleUsers).map((user: SCUserType, index) => (
            <User elevation={0} user={user} key={index} followed={followed} />
          ))}
        </List>
        {hasMore && (
          <Button size="small" sx={{color: ' black'}} onClick={() => loadUsers()}>
            See More
          </Button>
        )}
      </CardContent>
    </Root>
  );
}
export default UsersFollowed;
