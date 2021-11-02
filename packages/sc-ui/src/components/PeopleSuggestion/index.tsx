import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {PeopleSuggestionSkeleton} from '../Skeleton';
import User from '../User';

const PREFIX = 'SCPeopleSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function SCPeopleSuggestion(): JSX.Element {
  const [users, setUsers] = useState<SCUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openPeopleSuggestionDialog, setOpenPeopleSuggestionDialog] = useState<boolean>(false);

  function fetchUserSuggestion() {
    http
      .request({
        url: Endpoints.UserSuggestion.url(),
        method: Endpoints.UserSuggestion.method
      })
      .then((res) => {
        const data = res.data;
        setUsers(data['results']);
        setHasMore(data['count'] > 2);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUserForTest() {
    console.log('fetchUserForTest 1');
    http
      .request({
        url: Endpoints.UserSuggestion.url(),
        method: Endpoints.UserSuggestion.method
      })
      .then((res) => {
        const data = res.data;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log('fetchUserForTest 2');
    http
      .request({
        url: Endpoints.UserSuggestion.url(),
        method: Endpoints.UserSuggestion.method
      })
      .then((res) => {
        const data = res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUserSuggestion();
  }, []);

  if (loading) {
    return <PeopleSuggestionSkeleton />;
  }
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">People suggestion</Typography>
        <List>
          {users.slice(0, 2).map((user: SCUserType, index) => (
            <User contained={false} scUser={user} key={index} />
          ))}
        </List>
        <Button color="secondary" size="small" onClick={() => fetchUserForTest()}>
          Show All
        </Button>
        {openPeopleSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}
