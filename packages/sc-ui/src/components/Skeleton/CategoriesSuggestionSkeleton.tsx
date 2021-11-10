import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import CategoryBoxSkeleton from './UserBoxSkeleton';

const PREFIX = 'SCCategoriesSuggestionSkeleton';

const classes = {
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

export default function CategoriesSuggestionSkeleton(): JSX.Element {
  return (
    <Root variant={'outlined'}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((category, index) => (
            <CategoryBoxSkeleton key={index} contained={false} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
