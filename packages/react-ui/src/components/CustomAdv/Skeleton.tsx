import React from 'react';
import {GenericSkeleton} from '../Skeleton';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Custom Adv Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CustomAdvSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCustomAdv-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCustomAdv-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CustomAdvSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
