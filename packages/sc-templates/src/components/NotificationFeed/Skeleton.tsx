import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedSkeleton, GenericSkeleton, NotificationSkeleton} from '@selfcommunity/ui';

const PREFIX = 'SCNotificationFeedSkeleton';

const Root = styled(FeedSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export default function NotificationFeedSkeleton(): JSX.Element {
  return (
    <Root
      sidebar={
        <React.Fragment>
          <GenericSkeleton sx={{mb: 2}} />
          <GenericSkeleton sx={{mb: 2}} />
        </React.Fragment>
      }>
      {Array.from({length: 5}).map((e, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </Root>
  );
}
