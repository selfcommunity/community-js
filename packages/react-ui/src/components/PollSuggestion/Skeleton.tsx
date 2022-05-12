import React from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {CardContent, List, ListItem} from '@mui/material';
import {PollSnippetSkeleton} from './PollSnippet';

const PREFIX = 'SCPollSuggestionSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

/**
 * > API documentation for the Community-JS Poll Suggestion Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PollSuggestionSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPollSuggestionSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSuggestionSkeleton-root|Styles applied to the root element.|
 |list|.SCPollSuggestionSkeleton-list|Styles applied to the list element.|
 *
 */
export default function PollSuggestionSkeleton(props): JSX.Element {
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
