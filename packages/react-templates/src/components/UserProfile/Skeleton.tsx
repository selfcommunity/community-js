import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {UserProfileHeaderSkeleton} from '@selfcommunity/react-ui';
import UserFeedSkeleton from '../UserFeed/Skeleton';

const PREFIX = 'SCUserProfileTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

/**
 * > API documentation for the Community-UI User Profile Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserProfileTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserProfileSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <UserProfileHeaderSkeleton />
      <UserFeedSkeleton />
    </Root>
  );
}
