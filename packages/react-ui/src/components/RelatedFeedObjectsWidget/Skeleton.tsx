import React from 'react';
import {TrendingFeedWidgetSkeleton} from '../TrendingFeedWidget';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCRelatedFeedObjectsWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(TrendingFeedWidgetSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Related Feed Objects Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedFeedObjectsWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCRelatedFeedObjectsWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCRelatedFeedObjectsWidgetSkeleton-root|Styles applied to the root element.|
 *
 */
export default function RelatedFeedObjectsWidgetSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
