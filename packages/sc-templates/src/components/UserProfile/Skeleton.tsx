import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {UserProfileHeaderSkeleton} from '@selfcommunity/ui';
import UserFeedSkeleton from '../UserFeed/Skeleton';

const PREFIX = 'SCUserProfileSkeleton';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export default function UserProfileSkeleton(): JSX.Element {
  return (
    <Root>
      <UserProfileHeaderSkeleton />
      <UserFeedSkeleton />
    </Root>
  );
}
