import React from 'react';
import {NotificationSkeleton} from '../Notification';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCToastNotificationsSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(NotificationSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-UI Toast Notifications Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ToastNotificationsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCToastNotificationsSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCToastNotificationsSkeleton-root|Styles applied to the root element.|
 *
 */
export default function ToastNotificationsSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
