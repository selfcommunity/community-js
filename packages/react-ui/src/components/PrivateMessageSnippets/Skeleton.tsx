import React from 'react';
import Widget from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import PrivateMessageSnippetItemSkeleton from '../PrivateMessageSnippetItem/Skeleton';
import {Button, CardContent, Skeleton, Stack} from '@mui/material';

const PREFIX = 'SCPrivateMessageSnippetsSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  searchBar: `${PREFIX}-search-bar`,
  button: `${PREFIX}-button`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({}));

/**
 * > API documentation for the Community-JS PrivateMessageSnippets Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippetsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippetsSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippetsSkeleton-root|Styles applied to the root element.|
 |searchBar|.SCPrivateMessageSnippetsSkeleton-search-bar|Styles applied to the search bar element.|
 |button|.SCPrivateMessageSnippetsSkeleton-button|Styles applied to the button element.|
 |list|.SCPrivateMessageSnippetsSkeleton-list|Styles applied to the list element.|
 *
 */
export default function PrivateMessageSnippetsSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <Stack direction="column" justifyContent="center" spacing={1} alignItems="center">
          <Button variant="outlined" size="medium" disabled className={classes.button}>
            <Skeleton height={20} width={100} variant={'rectangular'} />
          </Button>
          <Skeleton height={25} width={'100%'} variant={'rounded'} className={classes.searchBar} />
        </Stack>
        <List className={classes.list}>
          {[...Array(6)].map((category, index) => (
            <PrivateMessageSnippetItemSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
