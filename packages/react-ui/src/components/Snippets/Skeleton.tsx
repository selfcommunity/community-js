import React from 'react';
import Widget from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import SnippetMessageBoxSkeleton from '../Message/Skeleton';
import {CardContent} from '@mui/material';

const PREFIX = 'SCSnippetsSkeleton';

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
 * > API documentation for the Community-JS Snippets Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SnippetsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCSnippetsSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippetsSkeleton-root|Styles applied to the root element.|
 |list|.SCSnippetsSkeleton-list|Styles applied to the list element.|
 *
 */
export default function SnippetsSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((category, index) => (
            <SnippetMessageBoxSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
