import React from 'react';
import {PrivateMessageComponentSkeleton} from '@selfcommunity/react-ui';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCPrivateMessagesTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`
};
const Root = styled(PrivateMessageComponentSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

/**
 * > API documentation for the Community-JS Private Messages Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessagesSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCPrivateMessagesTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessagesTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function PrivateMessagesSkeleton(): JSX.Element {
  return <Root className={classes.root} />;
}
