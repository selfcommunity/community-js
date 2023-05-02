import React from 'react';
import CategoriesSuggestionWidgetSkeleton from '../CategoriesSuggestionWidget/Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCUserFollowedCategoriesWidgetSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(CategoriesSuggestionWidgetSkeleton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2)
}));
/**
 * > API documentation for the Community-JS User Profile Categories Followed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowedCategoriesWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowedCategoriesWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowedCategoriesWidgetSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserFollowedCategoriesWidgetSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
