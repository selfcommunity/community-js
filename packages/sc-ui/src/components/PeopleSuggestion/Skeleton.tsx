import React from 'react';
import {styled} from '@mui/material/styles';
import UserSkeleton from '../User/Skeleton';
import Widget from '../Widget';
import {List, CardContent, ListItem} from '@mui/material';

const PREFIX = 'SCPeopleSuggestionSkeleton';

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

function PeopleSuggestionSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((user, index) => (
            <ListItem key={index}>
              <UserSkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}

export default PeopleSuggestionSkeleton;
