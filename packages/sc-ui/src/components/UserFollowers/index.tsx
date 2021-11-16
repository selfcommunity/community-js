import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
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

function SCUserFollowers({scPersonId = null}: {scPersonId?: number}): JSX.Element {
  const [followers, setFollowers] = useState<any[]>([]);
  const [lUfollowers, setLUFollowers] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openMutualPeopleDialog, setOpenMutualPeopleDialog] = useState<boolean>(false);

  function fetchUserFollowers() {
    http
      .request({
        url: Endpoints.UserFollowers.url({id: scPersonId}),
        method: Endpoints.UserFollowers.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setFollowers(data.results);
        setHasMore(data.count > visibleUsers);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchLUFollowers() {
    http
      .request({
        url: Endpoints.UserFollowers.url({id: 1}),
        method: Endpoints.UserFollowers.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setLUFollowers(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function loadUsers() {
    setVisibleUsers((prevVisibleUsers) => prevVisibleUsers + 3);
  }

  function getMutuals(followers, lUfollowers) {
    return followers.filter((f) => lUfollowers.some((lU) => f.id === lU.id));
  }

  function removeMutuals(followers, mutuals) {
    return followers.filter(function (val) {
      return mutuals.indexOf(val) == -1;
    });
  }

  useEffect(() => {
    fetchUserFollowers();
    fetchLUFollowers();
  }, []);

  if (loading) {
    return <PeopleSuggestionSkeleton />;
  }

  const mutualPeople = getMutuals(followers, lUfollowers);
  const filteredFollowers = removeMutuals(followers, mutualPeople);

  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">People</Typography>
        <Typography variant="body2">
          {total} ({mutualPeople.length} mutual)
        </Typography>
        <List>
          {mutualPeople.slice(0, visibleUsers).map((follower: SCUserType, index) => (
            <User elevation={0} user={follower} key={index} />
          ))}
        </List>
        <Divider />
        <List>
          {filteredFollowers.slice(0, visibleUsers).map((follower: SCUserType, index) => (
            <User elevation={0} user={follower} key={index} />
          ))}
        </List>
        {hasMore && (
          <Button size="small" sx={{color: ' black'}} onClick={() => loadUsers()}>
            See More
          </Button>
        )}
        {openMutualPeopleDialog && <></>}
      </CardContent>
    </Root>
  );
}
export default SCUserFollowers;
