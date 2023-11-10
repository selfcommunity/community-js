import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedSkeleton, GenericSkeleton, NotificationSkeleton} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(FeedSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Notification Feed Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NotificationFeedSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCNotificationFeedTemplate-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNotificationFeedTemplate-skeleton-root|Styles applied to the root element.|
 *
 */
export default function NotificationFeedSkeleton(): JSX.Element {
  return (
    <Root
      className={classes.root}
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
