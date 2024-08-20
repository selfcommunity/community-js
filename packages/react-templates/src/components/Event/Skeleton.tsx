import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import EventFeedSkeleton from '../EventFeed/Skeleton';
import {EventHeaderSkeleton} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Group Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventSkeletonTemplate} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCEventTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function EventSkeletonTemplate(): JSX.Element {
  return (
    <Root className={classes.root}>
      <EventHeaderSkeleton />
      <EventFeedSkeleton />
    </Root>
  );
}
