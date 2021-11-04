import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Avatar, Button, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {Endpoints, http} from '@selfcommunity/core';
import InterestBoxSkeleton from '../Skeleton/InterestBoxSkeleton';
import FollowButton from '../Button';

const PREFIX = 'SCInterest';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface SCInterestType {
  name: string;
  image_original?: string;
  slogan?: string;
}

export default function SCInterest({
  scInterestId = null,
  scInterest = null,
  contained = true,
  followed = false
}: {
  scInterestId?: number;
  scInterest?: SCInterestType;
  contained: boolean;
  followed: boolean;
}): JSX.Element {
  const [interest, setInterest] = useState<SCInterestType>(scInterest);

  /**
   * If interest not in props, attempt to get the interest by id (in props) if exist
   */
  function fetchInterest() {
    http
      .request({
        url: Endpoints.Category.url({id: scInterestId}),
        method: Endpoints.Category.method
      })
      .then((res) => {
        const data = res.data;
        setInterest(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Render follow status
   * @return {JSX.Element}
   */
  function renderFollowStatus() {
    return <React.Fragment>{followed ? <FollowButton>Followed</FollowButton> : <FollowButton>Follow</FollowButton>}</React.Fragment>;
  }

  useEffect(() => {
    if (!interest) {
      fetchInterest();
    }
  }, []);

  const i = (
    <React.Fragment>
      {interest ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={interest.name} src={interest.image_original} variant="square" />
          </ListItemAvatar>
          <ListItemText primary={interest.name} secondary={interest.slogan} />
          <ListItemSecondaryAction>{renderFollowStatus()}</ListItemSecondaryAction>
        </ListItem>
      ) : (
        <InterestBoxSkeleton contained />
      )}
    </React.Fragment>
  );

  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{i}</List>
        </CardContent>
      </Root>
    );
  }
  return i;
}
