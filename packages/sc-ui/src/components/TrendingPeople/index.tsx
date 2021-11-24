import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import {PeopleSuggestionSkeleton} from '../Skeleton';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCTrendingPeople';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

function SCTrendingPeople({scCategoryId = null, ...rest}: {scCategoryId?: number}): JSX.Element {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPeopleDialog, setOpenTrendingPeopleDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  function fetchTrendingPeople() {
    http
      .request({
        url: Endpoints.CategoryTrendingPeople.url({id: scCategoryId}),
        method: Endpoints.CategoryTrendingPeople.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPeople(data.results);
        setHasMore(data.count > 4);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchTrendingPeople();
  }, []);

  return (
    <Root {...rest}>
      {loading ? (
        <PeopleSuggestionSkeleton />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.TrendingPeople.title" defaultMessage="ui.TrendingPeople.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.TrendingPeople.noResults" defaultMessage="ui.TrendingPeople.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {people.slice(0, 4).map((p) => (
                  <ListItem button={true} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={p.username} variant="circular" src={p.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography sx={{display: 'inline'}} color="primary">
                            {p.username}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <Button
                          sx={{maxWidth: '20px', maxHeight: '20px', minWidth: '10px', minHeight: '10px', paddingRight: '20px'}}
                          variant="outlined"
                          startIcon={<ThumbUpOutlinedIcon sx={{width: '0.7em', marginLeft: '9px'}} />}>
                          {p.followers_counter}
                        </Button>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </React.Fragment>
          )}
          {hasMore && (
            <Button size="small" onClick={() => setOpenTrendingPeopleDialog(true)}>
              <FormattedMessage id="ui.TrendingPeople.showAll" defaultMessage="ui.TrendingPeople.showAll" />
            </Button>
          )}
          {openTrendingPeopleDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}
export default SCTrendingPeople;
