import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import CategoryFeedSkeleton from '../CategoryFeed/Skeleton';
import {CategoryHeaderSkeleton} from '@selfcommunity/react-ui';

const PREFIX = 'SCCategoryTemplateSkeleton';

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
 * > API documentation for the Community-UI Category Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategorySkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCCategoryTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryTemplateSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CategorySkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CategoryHeaderSkeleton />
      <CategoryFeedSkeleton />
    </Root>
  );
}
