import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import PersonBoxSkeleton from '../Skeleton/PersonBoxSkeleton';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import {AxiosResponse} from 'axios';

const PREFIX = 'SCPerson';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface SCPersonType extends SCUserType {
  followers_counter?: number;
}

function Person({
  scCategoryId = null,
  scPerson = null,
  contained = true
}: {
  scCategoryId?: number;
  scPerson?: SCPersonType;
  contained: boolean;
}): JSX.Element {
  const [person, setPerson] = useState<SCPersonType>(scPerson);

  /**
   * If person not in props, attempt to get the person by id (in props) if exist
   */
  function fetchPerson() {
    http
      .request({
        url: Endpoints.CategoryTrendingPeople.url({id: scCategoryId}),
        method: Endpoints.CategoryTrendingPeople.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setPerson(data.results[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (!person) {
      fetchPerson();
    }
  }, []);

  const p = (
    <React.Fragment>
      {person ? (
        <ListItem button={true} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={person.username} variant="circular" src={person.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <Typography sx={{display: 'inline'}} color="primary">
                  {person.username}
                </Typography>
              </React.Fragment>
            }
            secondary={
              <Button
                sx={{maxWidth: '20px', maxHeight: '20px', minWidth: '10px', minHeight: '10px', paddingRight: '20px'}}
                variant="outlined"
                startIcon={<ThumbUpOutlinedIcon sx={{width: '0.7em', marginLeft: '9px'}} />}>
                {person.followers_counter}
              </Button>
            }
          />
        </ListItem>
      ) : (
        <PersonBoxSkeleton contained />
      )}
    </React.Fragment>
  );

  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{p}</List>
        </CardContent>
      </Root>
    );
  }
  return p;
}
export default Person;
