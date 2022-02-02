import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCFollowedManagerType, SCUserContext, SCUserContextType, SCUserType, useSCUser} from '@selfcommunity/core';
import PeopleSuggestionSkeleton from '../PeopleSuggestion/Skeleton';
import User from '../User';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCUserFollowed';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function UserFollowed({userId = null, ...props}: {userId?: number; [p: string]: any}): JSX.Element {
  const [followed, setFollowed] = useState<any[]>([]);
  const [lUfollowed, setLUFollowed] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openMutualPeopleDialog, setOpenMutualPeopleDialog] = useState<boolean>(false);

  function fetchUserFollowed() {
    http
      .request({
        url: Endpoints.UsersFollowed.url({id: userId}),
        method: Endpoints.UsersFollowed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setFollowed(data.results);
        setHasMore(data.count > visibleUsers);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchLUFollowed() {
    http
      .request({
        url: Endpoints.UsersFollowed.url({id: 1}),
        method: Endpoints.UsersFollowed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setLUFollowed(data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function loadUsers() {
    setVisibleUsers((prevVisibleUsers) => prevVisibleUsers + 3);
  }

  function getMutuals(followed, lUfollowed) {
    return followed.filter((f) => lUfollowed.some((lU) => f.id === lU.id));
  }

  function removeMutuals(followed, mutuals) {
    return followed.filter(function (val) {
      return mutuals.indexOf(val) == -1;
    });
  }

  useEffect(() => {
    fetchUserFollowed();
    fetchLUFollowed();
  }, []);

  if (loading) {
    return <PeopleSuggestionSkeleton />;
  }

  const mutualPeople = getMutuals(followed, lUfollowed);
  const filteredFollowers = removeMutuals(followed, mutualPeople);

  const u = (
    <React.Fragment>
      <CardContent>
        <Typography variant="body1">People</Typography>
        <Typography variant="body2">
          {total} ({mutualPeople.length} mutual)
        </Typography>
        <List>
          {mutualPeople.slice(0, visibleUsers).map((follower: SCUserType, index) => (
            <User elevation={0} user={follower} key={follower.id} />
          ))}
        </List>
        <Divider />
        <List>
          {filteredFollowers.slice(0, visibleUsers).map((followed: SCUserType, index) => (
            <User elevation={0} user={followed} key={followed.id} />
          ))}
        </List>
        {hasMore && (
          <Button size="small" sx={{color: ' black'}} onClick={() => loadUsers()}>
            See More
          </Button>
        )}
        {openMutualPeopleDialog && <></>}
      </CardContent>
    </React.Fragment>
  );

  if (!props.autoHide) {
    return <Root {...props}>{u}</Root>;
  }
  return null;
}
