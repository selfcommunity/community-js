import React from 'react';
import CategoriesSuggestionSkeleton from '../CategoriesSuggestion/Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCCategoriesPopularSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(CategoriesSuggestionSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2)
}));
/**
 * > API documentation for the Community-JS Categories Popular Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesPopularSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoriesPopularSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopularSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CategoriesPopularSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
