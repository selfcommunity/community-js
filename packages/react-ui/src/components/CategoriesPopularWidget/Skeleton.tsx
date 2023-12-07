import React from 'react';
import CategoriesSuggestionWidgetSkeleton from '../CategoriesSuggestionWidget/Skeleton';
import {styled} from '@mui/material/styles';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(CategoriesSuggestionWidgetSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Categories Popular Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesPopularSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoriesPopularWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesPopularWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function CategoriesPopularSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
