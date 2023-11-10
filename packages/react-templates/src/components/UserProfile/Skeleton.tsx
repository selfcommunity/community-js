import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {UserProfileHeaderSkeleton} from '@selfcommunity/react-ui';
import UserFeedSkeleton from '../UserFeed/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS User Profile Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserProfileTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function UserProfileSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <UserProfileHeaderSkeleton />
      <UserFeedSkeleton />
    </Root>
  );
}
