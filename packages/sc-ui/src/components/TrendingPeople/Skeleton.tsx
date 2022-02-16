import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';

const PREFIX = 'SCTrendingPeopleSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Card)(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),

  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

export default function TrendingPeopleSkeleton(): JSX.Element {
  return (
    <Root variant={'outlined'} className={classes.root}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((person, index) => (
            <UserSkeleton key={index} contained={false} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
