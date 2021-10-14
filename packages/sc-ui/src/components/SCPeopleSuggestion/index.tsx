import React, {useEffect, useState } from 'react'
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import { Button, Typography } from '@mui/material'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import { SCPeopleSuggestionSkeleton } from '../SCSkeleton';
import SCUser from '../SCUser';

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
  const [users, setUsers] = useState<any[]>([]);
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
        setUsers(data.results);
        setHasMore(data.count > 4);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUserSuggestion();
  }, []);

  if (loading) {
    return <SCPeopleSuggestionSkeleton />;
  };
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <Typography variant="body1">
          People suggestion
        </Typography>
        <List>
          {users.slice(0, 4).map((user: {username: string}, index) => (
            <SCUser contained={false} scUser={user} key={index} />
          ))}
        </List>
        {hasMore && (
          <Button size="small" onClick={() => setOpenPeopleSuggestionDialog(true)}>
            Show All
          </Button>
        )}
        {openPeopleSuggestionDialog && (<></>)}
      </CardContent>
    </Root>
  );
}
