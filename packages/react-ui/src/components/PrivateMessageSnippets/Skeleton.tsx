import React from 'react';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import PrivateMessageSnippetItemSkeleton from '../PrivateMessageSnippetItem/Skeleton';
import {Button, Card, CardContent, Skeleton, Stack} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  searchBar: `${PREFIX}-search-bar`,
  button: `${PREFIX}-button`,
  list: `${PREFIX}-list`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS PrivateMessageSnippets Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippetsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippets-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippets-skeleton-root|Styles applied to the root element.|
 |searchBar|.SCPrivateMessageSnippets-search-bar|Styles applied to the search bar element.|
 |button|.SCPrivateMessageSnippets-button|Styles applied to the button element.|
 |list|.SCPrivateMessageSnippets-list|Styles applied to the list element.|
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
