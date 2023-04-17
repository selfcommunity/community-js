import React from 'react';
import CategoriesSuggestionWidgetSkeleton from '../CategoriesSuggestionWidget/Skeleton';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCCategoriesFollowedWidgetSkeleton';

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
 * > API documentation for the Community-JS Categories Followed Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesFollowedWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoriesFollowedWidgetSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesFollowedWidgetSkeleton-root|Styles applied to the root element.|
 *
 */
export default function CategoriesFollowedWidgetSkeleton(props): JSX.Element {
  return <Root className={classes.root} {...props} />;
}
