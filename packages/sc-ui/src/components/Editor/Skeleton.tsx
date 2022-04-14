import React from 'react';
import {GenericSkeleton} from '../Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCEditorSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-UI Editor Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EditorSkeleton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCEditorSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEditorSkeleton-root|Styles applied to the root element.|
 *
 */
export default function EditorSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
