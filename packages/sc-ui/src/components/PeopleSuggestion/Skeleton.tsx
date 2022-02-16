import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';

const PREFIX = 'SCPeopleSuggestionSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Card)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

function PeopleSuggestionSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((user, index) => (
            <UserSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}

export default PeopleSuggestionSkeleton;
