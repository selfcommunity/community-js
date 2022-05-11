import React from 'react';
import {styled} from '@mui/material/styles';
import GenericSkeleton from '../Skeleton/GenericSkeleton';

const PREFIX = 'SCFeedUpdatesSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(GenericSkeleton)(() => ({}));

/**
 * > API documentation for the Community-UI Feed Updates Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FeedUpdatesSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCFeedUpdatesSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFeedUpdatesSkeleton-root|Styles applied to the root element.|
 |list|.SCFeedUpdatesSkeleton-list|Styles applied to the list element.|
 *
 */
export default function FeedUpdatesSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
