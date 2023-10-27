import React from 'react';
import {styled} from '@mui/material/styles';
import Widget from '../Widget';
import {CardContent, List, ListItem} from '@mui/material';
import {PollSnippetSkeleton} from './PollSnippet';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Poll Suggestion Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PollSuggestionWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPollSuggestionWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPollSuggestionWidget-skeleton-root|Styles applied to the root element.|
 |list|.SCPollSuggestionWidget-list|Styles applied to the list element.|
 *
 */
export default function PollSuggestionWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <Skeleton animation="wave" height={10} width={120} />
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
