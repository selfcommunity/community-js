import React from 'react';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import CategorySkeleton from '../Category/Skeleton';
import Widget from '../Widget';
import {CardContent, ListItem} from '@mui/material';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Categories Suggestion Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesSuggestionWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoriesSuggestionWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesSuggestionWidget-skeleton-root|Styles applied to the root element.|
 |list|.SCCategoriesSuggestionWidget-list|Styles applied to the list element.|
 *
 */
export default function CategoriesSuggestionWidgetSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((category, index) => (
            <ListItem key={index}>
              <CategorySkeleton elevation={0} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
