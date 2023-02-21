import React from 'react';
import {styled} from '@mui/material/styles';
import GenericSkeleton from '../Skeleton/GenericSkeleton';

const PREFIX = 'SCPrivateMessageActionMenuSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(GenericSkeleton)(({theme}) => ({}));
/**
 * > API documentation for the Community-JS PrivateMessageActionMenu Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageActionMenuSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageActionMenuSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageActionMenuSkeleton-root|Styles applied to the root element.|

 *
 */
export default function PrivateMessageActionMenuSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
