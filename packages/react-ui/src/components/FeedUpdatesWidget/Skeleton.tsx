import React from 'react';
import {styled} from '@mui/material/styles';
import GenericSkeleton from '../Skeleton/GenericSkeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Feed Updates Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedUpdatesWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedUpdatesWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedUpdatesWidget-skeleton-root|Styles applied to the root element.|
 |list|.SCFeedUpdatesWidget-list|Styles applied to the list element.|
 *
 */
export default function FeedUpdatesWidgetSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
