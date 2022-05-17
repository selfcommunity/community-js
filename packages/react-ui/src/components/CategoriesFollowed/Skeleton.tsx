import React from 'react';
import CategoriesSuggestionSkeleton from '../CategoriesSuggestion/Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCCategoriesFollowedSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(CategoriesSuggestionSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));
/**
 * > API documentation for the Community-JS Categories Followed Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesFollowedSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoriesFollowedSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesFollowedSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CategoriesFollowedSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
