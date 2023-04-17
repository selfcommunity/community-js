import React from 'react';
import {styled} from '@mui/material/styles';
import GenericSkeleton from '../Skeleton/GenericSkeleton';

const PREFIX = 'SCFeedUpdatesWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(GenericSkeleton)(() => ({}));

/**
 * > API documentation for the Community-JS Feed Updates Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedUpdatesWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedUpdatesWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedUpdatesWidgetSkeleton-root|Styles applied to the root element.|
 |list|.SCFeedUpdatesWidgetSkeleton-list|Styles applied to the list element.|
 *
 */
export default function FeedUpdatesWidgetSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
