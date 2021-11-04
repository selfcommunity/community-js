import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import Person from '../Person';
import TrendingPeopleSkeleton from '../Skeleton/TrendingPeopleSkeleton';
import {withSCTheme} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCTrendingPeople.';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function SCTrendingPeople({scInterestId = null}: {scInterestId?: number}): JSX.Element {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPeopleDialog, setOpenTrendingPeopleDialog] = useState<boolean>(false);

  function fetchTrendingPeople() {
    http
      .request({
        url: Endpoints.CategoryTrendingPeople.url({id: scInterestId}),
        method: Endpoints.CategoryTrendingPeople.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPeople(data.results);
        setHasMore(data.count > 4);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchTrendingPeople();
  }, []);

  if (loading) {
    return <TrendingPeopleSkeleton />;
  }
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">Trending People</Typography>
        <List>
          {people.slice(0, 4).map((people: {username: string}, index) => (
            <Person contained={false} scPerson={people} key={index} />
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => setOpenTrendingPeopleDialog(true)}>
            Show All
          </Button>
        )}
        {openTrendingPeopleDialog && <></>}
      </CardContent>
    </Root>
  );
}
export default withSCTheme(SCTrendingPeople);
