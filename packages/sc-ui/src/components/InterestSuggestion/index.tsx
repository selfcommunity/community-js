import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import InterestSuggestionSkeleton from '../Skeleton/InterestSuggestionSkeleton';
import Interest from '../Interest';

const PREFIX = 'SCInterestSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function SCInterestSuggestion(): JSX.Element {
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);
  const [openInterestSuggestionDialog, setOpenInterestSuggestionDialog] = useState<boolean>(false);

  function fetchInterestSuggestion() {
    http
      .request({
        url: Endpoints.CategorySuggestion.url(),
        method: Endpoints.CategorySuggestion.method
      })
      .then((res) => {
        const data = res.data;
        setInterests(data.results);
        setHasMore(data.count > 4);
        setLoading(false);
        setFollowed(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchInterestSuggestion();
  }, []);

  if (loading) {
    return <InterestSuggestionSkeleton />;
  }
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">Explore Interests</Typography>
        <List>
          {interests.slice(0, 4).map((interest: {name: string}, index) => (
            <div key={index}>
              <Interest contained={false} scInterest={interest} followed={followed} />
              <Divider />
            </div>
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => setOpenInterestSuggestionDialog(true)}>
            See More
          </Button>
        )}
        {openInterestSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}
