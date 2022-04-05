import React from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {CardContent, List, ListItem} from '@mui/material';
import {PollSnippetSkeleton} from './PollSnippet';

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

function PollSuggestionSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((user, index) => (
            <ListItem key={index}>
              <PollSnippetSkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}

export default PollSuggestionSkeleton;
