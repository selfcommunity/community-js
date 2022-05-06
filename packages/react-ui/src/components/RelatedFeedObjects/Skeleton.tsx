import React from 'react';
import {TrendingFeedSkeleton} from '../TrendingFeed';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCRelatedFeedObjectsSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(TrendingFeedSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-UI Related Discussion Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {RelatedFeedObjectsSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCRelatedFeedObjectsSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCRelatedFeedObjectsSkeleton-root|Styles applied to the root element.|
 *
 */
export default function RelatedFeedObjectsSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
