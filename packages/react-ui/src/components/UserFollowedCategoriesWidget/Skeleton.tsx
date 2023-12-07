import React from 'react';
import CategoriesSuggestionWidgetSkeleton from '../CategoriesSuggestionWidget/Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCUserFollowedCategoriesWidgetSkeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(CategoriesSuggestionWidgetSkeleton, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS User Profile Categories Followed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowedCategoriesWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserCategoriesFollowedWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserCategoriesFollowedWidget-skeleton-root|Styles applied to the root element.|
 *
 */
export default function UserFollowedCategoriesWidgetSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
