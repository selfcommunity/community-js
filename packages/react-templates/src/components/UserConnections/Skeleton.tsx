import React from 'react';
import {styled} from '@mui/material/styles';
import {FeedSkeleton, UserSkeleton} from '@selfcommunity/react-ui';

const PREFIX = 'SCUserConnectionsTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(FeedSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

/**
 * > API documentation for the Community-JS User Feed Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserConnectionsSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserConnectionsTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFeedTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserConnectionsSkeleton(): JSX.Element {
  return (
    <Root className={classes.root} sidebar={<></>}>
      {Array.from({length: 5}).map((e, i) => (
        <UserSkeleton key={i} />
      ))}
    </Root>
  );
}
