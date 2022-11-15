import React from 'react';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import CategorySkeleton from '../Category/Skeleton';
import Widget from '../Widget';
import {CardContent, ListItem} from '@mui/material';

const PREFIX = 'SCCategoriesSuggestionSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  marginBottom: theme.spacing(2)
}));
/**
 * > API documentation for the Community-JS Categories Suggestion Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesSuggestionSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategoriesSuggestionSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesSuggestionSkeleton-root|Styles applied to the root element.|
 |list|.SCCategoriesSuggestionSkeleton-list|Styles applied to the list element.|
 *
 */
export default function CategoriesSuggestionSkeleton(props): JSX.Element {
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
