import React from 'react';
import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import {CategorySkeleton} from '@selfcommunity/react-ui';

const PREFIX = 'SCCategoriesListTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

/**
 * > API documentation for the Community-JS Categories List Skeleton Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategoriesListSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCCategoriesListTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoriesListTemplateSkeleton-root|Styles applied to the root element.|
 |list|.SCCategoriesListTemplateSkeleton-list|Styles applied to the list element.|
 *
 */
export default function CategoriesListSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}} className={classes.list}>
        {[...Array(22)].map((c, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <CategorySkeleton elevation={0} />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
