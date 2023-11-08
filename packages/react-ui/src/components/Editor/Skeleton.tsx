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
})(() => ({}));
/**
 * > API documentation for the Community-JS Editor Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EditorSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEditor-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEditor-skeleton-root|Styles applied to the root element.|
 *
 */
export default function EditorSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
