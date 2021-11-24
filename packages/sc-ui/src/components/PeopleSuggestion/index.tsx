import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {PeopleSuggestionSkeleton} from '../Skeleton';
import User from '../User';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCPeopleSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function PeopleSuggestion(props): JSX.Element {
  const [users, setUsers] = useState<SCUserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openPeopleSuggestionDialog, setOpenPeopleSuggestionDialog] = useState<boolean>(false);

  function fetchUserSuggestion() {
    http
      .request({
        url: Endpoints.UserSuggestion.url(),
        method: Endpoints.UserSuggestion.method
      })
      .then((res: any) => {
        const data = res.data;
        setUsers(data['results']);
        setHasMore(data['count'] > 2);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUserForTest() {
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

  return (
    <Root {...props}>
      {loading ? (
        <PeopleSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.peopleSuggestion.title" defaultMessage="ui.peopleSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.peopleSuggestion.subtitle.noResults" defaultMessage="ui.peopleSuggestion.subtitle.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {users.slice(0, 2).map((user: SCUserType, index) => (
                  <User elevation={0} user={user} id={user.id} key={index} />
                ))}
              </List>
              {hasMore && (
                <Button color="secondary" size="small" onClick={() => fetchUserForTest()}>
                  <FormattedMessage id="ui.peopleSuggestion.button.showAll" defaultMessage="ui.peopleSuggestion.button.showAll" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openPeopleSuggestionDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}

export default PeopleSuggestion;
