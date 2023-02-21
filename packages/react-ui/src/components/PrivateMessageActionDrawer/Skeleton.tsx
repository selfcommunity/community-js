import React from 'react';
import {styled} from '@mui/material/styles';
import GenericSkeleton from '../Skeleton/GenericSkeleton';

const PREFIX = 'SCPrivateMessageActionDrawerSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton)(({theme}) => ({}));
/**
 * > API documentation for the Community-JS PrivateMessageActionDrawer Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageActionDrawerSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageActionDrawerSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageActionDrawerSkeleton-root|Styles applied to the root element.|
 *
 */
export default function PrivateMessageActionDrawerSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
