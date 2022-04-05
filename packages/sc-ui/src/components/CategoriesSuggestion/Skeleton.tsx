import React from 'react';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import CategorySkeleton from '../Category/Skeleton';
import Widget from '../Widget';
import {CardContent, ListItem} from '@mui/material';

const PREFIX = 'SCCategoriesSuggestionSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

export default function CategoriesSuggestionSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((category, index) => (
            <ListItem key={index}>
              <CategorySkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
