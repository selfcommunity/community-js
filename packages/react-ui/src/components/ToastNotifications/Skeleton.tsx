import React from 'react';
import {NotificationSkeleton} from '../Notification';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(NotificationSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Toast Notifications Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ToastNotificationsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCToastNotifications-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCToastNotifications-skeleton-root|Styles applied to the root element.|
 *
 */
export default function ToastNotificationsSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
